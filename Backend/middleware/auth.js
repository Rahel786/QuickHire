import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: 'Authorization token missing' });
    }
    const secret = process.env.JWT_SECRET || 'quickhire_secret_key';
    const decoded = jwt.verify(token, secret);
    req.user = { id: decoded.userId, email: decoded.email };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};


