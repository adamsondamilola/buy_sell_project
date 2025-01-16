const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied' });
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.HASH_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'You are not logged in'});
  }
};

module.exports = authMiddleware;
