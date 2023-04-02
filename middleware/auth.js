const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  // Get JWT token from cookie
  const token = req.cookies.jwt;

  // Check if JWT token exists
  if (!token) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, config.get('jwtsecret'));

    // Add user ID to request object
    req.user = decoded;

    // Continue to next middleware or route handler
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Unauthorized' });
  }
};
