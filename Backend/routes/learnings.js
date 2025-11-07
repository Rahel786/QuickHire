import express from 'express';
import { LearningPlan } from '../models/LearningPlan.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all learning plans for a user
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['user-id'] || req.query.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const query = { user_id: userId };

    const plans = await LearningPlan.find(query)
      .populate('user_id', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      plans,
      count: plans.length
    });
  } catch (error) {
    console.error('Get learning plans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate AI-based learning plan (LLM-backed)
router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { technology, totalDays, dailyHours, explanationType } = req.body || {};

    const techName = technology?.name || 'General Software Engineering';
    const days = Math.max(1, Math.min(Number(totalDays) || 7, 30));
    const hours = Math.max(1, Math.min(Number(dailyHours) || 2, 8));
    const level = explanationType || 'beginner';

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'LLM API key missing. Set OPENAI_API_KEY in environment.' });
    }

    const systemPrompt = `You are a planning assistant that creates structured interview preparation plans.
Return STRICT JSON only. No comments, no markdown.
Schema: { dailyPlans: Array<{ day_number: number, core_concepts: string[], learning_resources: string[], practice_questions: string[], interview_questions: Array<{ question: string, answer: string }>, learning_context: string, estimated_hours: number }> }`;

    const userPrompt = `Create a ${days}-day interview preparation plan for ${techName} at ${level} level.
Daily study time: ${hours} hours per day.
Requirements per day:
- 3-5 core_concepts
- 2-4 learning_resources (URLs or titles)
- At least 5 practice_questions
- At least 5 interview_questions with concise answers (2-4 sentences)
- 1-2 sentence learning_context
Return exactly ${days} entries with day_number starting at 1 and increasing by 1.`;

    // Use global fetch if available (Node 18+); otherwise lazy-import node-fetch
    const doFetch = globalThis.fetch || (await import('node-fetch')).default;

    const response = await doFetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      let errBody;
      try {
        errBody = await response.json();
      } catch {
        errBody = await response.text();
      }
      console.error('LLM error:', errBody);
      return res.status(502).json({ error: 'Failed to generate plan from LLM', details: errBody });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    let parsed;
    try {
      parsed = typeof content === 'string' ? JSON.parse(content) : content;
    } catch (e) {
      console.error('Parse error:', e, content);
      return res.status(502).json({ error: 'Invalid response from LLM' });
    }

    const rawPlans = Array.isArray(parsed?.dailyPlans) ? parsed.dailyPlans : [];
    if (rawPlans.length === 0) {
      return res.status(502).json({ error: 'LLM returned empty plan' });
    }

    // Normalize and enforce minimum questions per day
    const dailyPlans = rawPlans.slice(0, days).map((p, idx) => {
      const dayNum = Number(p?.day_number) || (idx + 1);
      const coreConcepts = Array.isArray(p?.core_concepts) ? p.core_concepts : [];
      const resources = Array.isArray(p?.learning_resources) ? p.learning_resources : [];
      const practiceQs = Array.isArray(p?.practice_questions) ? p.practice_questions : [];
      let interviewQs = Array.isArray(p?.interview_questions) ? p.interview_questions : [];

      // Coerce interview questions into {question, answer}
      interviewQs = interviewQs.map((q) => {
        if (typeof q === 'string') return { question: q, answer: '' };
        if (q && typeof q === 'object') return { question: q.question || '', answer: q.answer || '' };
        return { question: '', answer: '' };
      });

      // Ensure at least 5 practice and interview questions
      const padQuestion = (i) => `Explain a key concept of ${techName} (variant ${i}).`;
      while (practiceQs.length < 5) practiceQs.push(padQuestion(practiceQs.length + 1));
      while (interviewQs.length < 5) interviewQs.push({ question: padQuestion(interviewQs.length + 1), answer: '' });

      return {
        day_number: dayNum,
        core_concepts: coreConcepts,
        learning_resources: resources,
        practice_questions: practiceQs,
        interview_questions: interviewQs.map(q => ({
          question: q.question,
          answer: q.answer,
          answerType: 'text',
          impressTip: ''
        })),
        learning_context: typeof p?.learning_context === 'string' ? p.learning_context : '',


        
        estimated_hours: hours,
        is_completed: false
      };
    });

    return res.json({
      technology: technology || { name: techName },
      config: { totalDays: days, dailyHours: hours, explanationType: level },
      dailyPlans
    });
  } catch (error) {
    console.error('AI plan generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific learning plan
router.get('/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await LearningPlan.findById(planId)
      .populate('user_id', 'name email');

    if (!plan) {
      return res.status(404).json({ error: 'Learning plan not found' });
    }

    res.json({ plan });
  } catch (error) {
    console.error('Get learning plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new learning plan
router.post('/', requireAuth, async (req, res) => {
  try {
    const planData = req.body;
    const userId = req.user?.id || req.headers['user-id'];

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const newPlan = new LearningPlan({
      user_id: userId,
      ...planData,
      status: 'active',
      started_at: new Date(),
      progress: 0
    });

    await newPlan.save();
    await newPlan.populate('user_id', 'name email');

    res.status(201).json({
      plan: newPlan,
      message: 'Learning plan created successfully'
    });
  } catch (error) {
    console.error('Create learning plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update learning plan (owner only)
router.put('/:planId', requireAuth, async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user?.id;

    const plan = await LearningPlan.findOneAndUpdate(
      { _id: planId, user_id: userId },
      req.body,
      { new: true, runValidators: true }
    ).populate('user_id', 'name email');

    if (!plan) {
      return res.status(404).json({ error: 'Learning plan not found' });
    }

    res.json({
      plan,
      message: 'Learning plan updated successfully'
    });
  } catch (error) {
    console.error('Update learning plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete learning plan (owner only)
router.delete('/:planId', requireAuth, async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user?.id;
    const plan = await LearningPlan.findOneAndDelete({ _id: planId, user_id: userId });

    if (!plan) {
      return res.status(404).json({ error: 'Learning plan not found' });
    }

    res.json({ message: 'Learning plan deleted successfully' });
  } catch (error) {
    console.error('Delete learning plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as learningsRouter };


