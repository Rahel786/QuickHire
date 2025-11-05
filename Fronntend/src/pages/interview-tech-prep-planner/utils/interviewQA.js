// Interview Q&A generator based on tech stack and explanation level
export const getInterviewQuestions = (tech, day, level) => {
  const questions = {
    'React': {
      beginner: [
        {
          question: "What is JSX and why do we use it?",
          answer: "JSX is a syntax extension for JavaScript that allows writing HTML-like code in JavaScript. We use it because it makes React code more readable and allows us to describe UI structure clearly. It gets compiled to React.createElement calls.",
          answerType: "Clear and simple explanation with practical benefit",
          impressTip: "Mention that JSX is syntactic sugar and show you understand the compilation process"
        },
        {
          question: "Explain the difference between props and state",
          answer: "Props are read-only data passed from parent to child components, while state is mutable data managed within a component. Props flow down, state is internal. When state changes, component re-renders.",
          answerType: "Contrast both concepts with key differences",
          impressTip: "Give a quick example: 'Props are like function parameters, state is like variables inside a function'"
        }
      ],
      intermediate: [
        {
          question: "How would you optimize a React component that re-renders too often?",
          answer: "I would use React.memo for functional components to prevent unnecessary re-renders, useMemo for expensive calculations, and useCallback for function references. I'd also check if state updates are batched properly and consider splitting large components.",
          answerType: "Multiple solutions with specific tools",
          impressTip: "Mention you'd first use React DevTools Profiler to identify the issue before optimizing"
        },
        {
          question: "Explain useEffect and its dependency array",
          answer: "useEffect runs side effects after render. The dependency array controls when it runs: empty array means run once on mount, no array means run on every render, and with dependencies means run when those values change. Always include all used variables in dependencies.",
          answerType: "Comprehensive explanation with all scenarios",
          impressTip: "Mention cleanup functions and give a real example like API calls or subscriptions"
        }
      ],
      advanced: [
        {
          question: "How does React's reconciliation algorithm work?",
          answer: "React uses a diffing algorithm that compares virtual DOM trees. It assumes different element types produce different trees, uses keys for list reconciliation, and performs fiber-based updates for better performance. The algorithm is O(n) instead of O(n³) by making assumptions about how UIs typically change.",
          answerType: "Deep technical explanation with complexity analysis",
          impressTip: "Mention fiber architecture and how it enables time-slicing for better user experience"
        }
      ]
    },
    'Java': {
      beginner: [
        {
          question: "What is inheritance and how does it work in Java?",
          answer: "Inheritance allows a class to inherit properties and methods from another class. In Java, we use the 'extends' keyword. The child class (subclass) inherits from the parent class (superclass). This promotes code reusability and establishes an 'is-a' relationship.",
          answerType: "Definition with practical benefit",
          impressTip: "Mention the difference between 'is-a' (inheritance) and 'has-a' (composition) relationships"
        }
      ],
      intermediate: [
        {
          question: "Explain the difference between ArrayList and LinkedList",
          answer: "ArrayList is backed by a dynamic array, providing O(1) random access but O(n) insertion/deletion in middle. LinkedList uses nodes with pointers, providing O(1) insertion/deletion but O(n) random access. Use ArrayList when you need frequent random access, LinkedList when you need frequent insertions/deletions.",
          answerType: "Comparison with use cases and complexity analysis",
          impressTip: "Mention the memory overhead of LinkedList (pointer storage) vs ArrayList"
        }
      ],
      advanced: [
        {
          question: "How does garbage collection work in Java?",
          answer: "Java uses automatic garbage collection. The JVM identifies unreachable objects (no references pointing to them) and reclaims their memory. Common algorithms include Mark-and-Sweep, Generational GC (young/old generation), and G1GC. The GC runs in a separate thread and can pause application threads during collection.",
          answerType: "Detailed explanation of GC mechanisms",
          impressTip: "Mention different GC algorithms (G1, Parallel, CMS) and when to use each"
        }
      ]
    },
    'SQL': {
      beginner: [
        {
          question: "What is the difference between WHERE and HAVING?",
          answer: "WHERE filters rows before grouping (used with GROUP BY), while HAVING filters groups after grouping. WHERE cannot use aggregate functions, but HAVING can. Use WHERE for row-level filtering, HAVING for group-level filtering.",
          answerType: "Clear distinction with use cases",
          impressTip: "Give a practical example: 'WHERE filters employees by department, HAVING filters departments with count > 10'"
        }
      ],
      intermediate: [
        {
          question: "Explain different types of JOINs in SQL",
          answer: "INNER JOIN returns matching rows from both tables. LEFT JOIN returns all rows from left table and matching rows from right (NULL if no match). RIGHT JOIN is opposite of LEFT. FULL OUTER JOIN returns all rows from both tables. CROSS JOIN returns cartesian product.",
          answerType: "Comprehensive explanation of all JOIN types",
          impressTip: "Mention performance implications and when to use each type"
        }
      ],
      advanced: [
        {
          question: "What are database indexes and how do they work?",
          answer: "Indexes are data structures that improve query performance by allowing faster data retrieval. They work like a book index - instead of scanning every row, the database uses the index to quickly locate rows. Common types include B-tree, hash, and bitmap indexes. Trade-off: faster reads but slower writes and more storage.",
          answerType: "Technical explanation with trade-offs",
          impressTip: "Discuss index selectivity, covering indexes, and composite indexes"
        }
      ]
    },
    'Data Structures & Algorithms': {
      beginner: [
        {
          question: "Find if an array contains duplicate elements",
          answer: "I would use a HashSet to track seen elements. Iterate through the array, and for each element, check if it's in the set. If yes, return true. If not, add it to the set. Return false after the loop. Time: O(n), Space: O(n).",
          answerType: "Clear approach with complexity",
          impressTip: "Mention you could also sort first (O(n log n), O(1) space) as an alternative approach"
        }
      ],
      intermediate: [
        {
          question: "Design an LRU Cache with O(1) operations",
          answer: "I would use a HashMap for O(1) lookup and a doubly linked list for O(1) insertion/deletion. The map stores key -> node mapping. Most recent items are at the head, least recent at tail. On get, move node to head. On put, add to head and remove tail if capacity exceeded.",
          answerType: "Complete design with data structures and operations",
          impressTip: "Explain why both data structures are needed and walk through an example"
        }
      ],
      advanced: [
        {
          question: "Find the longest increasing subsequence in O(n log n)",
          answer: "I would use binary search with dynamic programming. Maintain an array where tail[i] is the smallest tail element of all increasing subsequences of length i+1. For each element, binary search for its position and update. The length of this array is the answer. This improves from O(n²) DP to O(n log n).",
          answerType: "Optimal algorithm with optimization explanation",
          impressTip: "Explain why this works and compare it to the naive O(n²) approach"
        }
      ]
    }
  };

  // Default to React if tech not found, or use first available
  const techQuestions = questions[tech] || questions['React'];
  const levelQuestions = techQuestions[level] || techQuestions['beginner'] || [];
  
  // Return questions based on day (distribute across days)
  const questionsPerDay = Math.max(1, Math.ceil(levelQuestions.length / 7));
  const startIdx = ((day - 1) * questionsPerDay) % levelQuestions.length;
  const endIdx = Math.min(startIdx + questionsPerDay, levelQuestions.length);
  
  return levelQuestions.slice(startIdx, endIdx).length > 0 
    ? levelQuestions.slice(startIdx, endIdx)
    : levelQuestions.slice(0, Math.min(questionsPerDay, levelQuestions.length));
};

export const getDayContent = (tech, day, level) => {
  const content = {
    'React': {
      beginner: `Focus on understanding the fundamentals. JSX is JavaScript XML that allows you to write HTML-like code in JavaScript. Components are reusable building blocks. Start with simple functional components and gradually move to more complex patterns.`,
      intermediate: `Apply React concepts to real-world scenarios. Understand component lifecycle, optimize renders, and manage state effectively. Focus on building complete features rather than isolated components.`,
      advanced: `Deep dive into React internals. Understand reconciliation, fiber architecture, and performance optimization techniques. Learn to make architectural decisions and handle complex state management scenarios.`
    },
    'Java': {
      beginner: `Start with OOP fundamentals. Understand classes, objects, inheritance, and polymorphism. Practice writing clean, well-structured Java code. Focus on understanding the 'why' behind each concept.`,
      intermediate: `Apply OOP principles to solve real problems. Work with collections, exception handling, and multithreading. Understand design patterns and when to use them.`,
      advanced: `Master JVM internals, memory management, and advanced concurrency. Understand performance optimization, garbage collection, and enterprise patterns.`
    },
    'SQL': {
      beginner: `Learn the basics of querying databases. Start with SELECT, WHERE, and basic JOINs. Understand data types and how to filter and sort data. Practice writing simple queries first.`,
      intermediate: `Master complex queries with multiple JOINs, subqueries, and window functions. Understand indexing, query optimization, and database design principles.`,
      advanced: `Deep dive into database internals, transaction management, isolation levels, and advanced optimization techniques. Understand distributed databases and scaling strategies.`
    },
    'Data Structures & Algorithms': {
      beginner: `Start with pattern recognition. Two pointers is about using two references to traverse data efficiently. Focus on understanding time and space complexity. Practice explaining your approach before coding.`,
      intermediate: `Connect algorithms to problem-solving patterns. Recognize when to use specific techniques. Practice explaining trade-offs between different approaches. Focus on optimization.`,
      advanced: `Master edge cases and optimal solutions. Understand the mathematical proofs behind algorithms. Practice explaining solutions with detailed complexity analysis and multiple approaches.`
    }
  };

  const techContent = content[tech] || content['React'];
  return techContent[level] || techContent['beginner'] || 'Focus on learning the core concepts and practicing regularly.';
};

