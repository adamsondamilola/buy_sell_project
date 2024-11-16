const jwt = require('jsonwebtoken');

const adminAuthMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied' });
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.HASH_KEY);
    req.user = decoded;
    if (req.user.role !== 'Admin') { return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token'});
  }
};

module.exports = adminAuthMiddleware;
