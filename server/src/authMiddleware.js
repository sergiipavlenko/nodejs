const jwt = require('jsonwebtoken');
const SECRET = 'your-secret';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.log('error', error);
    res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
