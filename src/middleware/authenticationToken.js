const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JSON_WEB_TOKEN_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET, (err, user) => {
    if(err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
