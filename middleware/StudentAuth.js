const jwt = require('jsonwebtoken');
const config = require('config');

 // Middleware function to authenticate user
const auth = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookie

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Authorization failed. Token missing.' });
  }

  try {
    // Verify token
    const decodedToken = jwt.verify(token, config.get('jwtsecret'));
    req.user = decodedToken;
    console.log(req.user);
    next(); // Pass the control to the next middleware
  } catch (err) {
    res.status(401).json({ message: 'Authorization failed. Invalid token.' });
  }
}

module.exports = auth;