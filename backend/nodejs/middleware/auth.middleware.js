const jwt = require('jsonwebtoken');
const secrets = require('/etc/secrets/secrets');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Auth error' });
    }
    const decoded = jwt.verify(token, secrets.jwtSecret);
    req.username = decoded.username;
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Internal Server Error', details: err.message });
  }
};
