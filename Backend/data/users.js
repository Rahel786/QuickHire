import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  const userId = user._id || user.id;
  return jwt.sign(
    { userId, email: user.email },
    process.env.JWT_SECRET || 'quickhire_secret_key',
    { expiresIn: '7d' }
  );
};


