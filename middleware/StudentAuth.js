const jwt = require('jsonwebtoken');
const config = require('config');
const mysql=require('mysql2');

// const adminAuthRoutes = require('./routes/adminAuth');
const conn=mysql.createConnection({
    host:"localhost",
    user:process.env.USER,
    password:process.env.PASSWORD
  });
  conn.connect((err)=>{
    if(err) throw err;
    console.log("Connected to MySQL Server");
  })
  conn.query("USE sonoo",function(err,result){
    if(err) throw err;
    console.log("Using database sonoo");
  });
  
module.exports = async function(req, res, next) {
  // Get JWT token from cookie
  const token = req.cookies.jwt;

  // Check if JWT token exists
  if (!token) {
    res.send('Login krlo pehle');
    // return res.status(401).redirect('/student/login');
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, config.get('jwtsecret'));

    // Add user ID to request object
    // const user = await User.findById(decoded.id);
    // if (!user) {
    //   throw new Error('User not found');
    // }
    console.log(decoded);
    const id=decoded.id;
    
    conn.query("SELECT * FROM students WHERE id = ?",[id],async function(err,result){
        if(err) throw err;
        if(result.length==0){
            throw new Error('User not found');
        }
    })
    req.id = id;
    next();
// console.log("Decoded"+JSON.stringify(decoded))
    // Continue to next middleware or route handler
//     next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Unauthorized' });
  }
};
