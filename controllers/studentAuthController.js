const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path=require('path') 
const mysql=require('mysql2');
require('dotenv').config()
// Authentication middleware

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

module.exports.login = (req, res) => {
  // Check if the user exists in the database
  const id = req.body.id;
  const password = req.body.password;
  console.log(req.body); 
  conn.query(`SELECT * FROM students WHERE id = '${id}' AND password = '${password}'`, (err, results) => {
    if (err) throw err;

    // If the user exists, create a JWT token and set it as a cookie
    if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign({ id: user.id }, config.get('jwtsecret'), { expiresIn: '1h' }); // Replace with your own token expiry time

      // Set the token as a cookie
      res.cookie('token', token);

      // Return the user data
      res.status(200).redirect('/student/dashboard');
    } else {
      // If the user does not exist, return an error
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
};

module.exports.studentDashboard = (req,res)=>{
    fs.readFile('./frontend/studentDashboard.html','utf-8',(err,data)=>{
        if(err){
            console.log(err);
            return res.status(500).send('Error reading file');
        }
        res.send(data);
    })
}

module.exports.courseRegister = (req,res)=>{
    fs.readFile('./frontend/courseRegister.html','utf-8',(err,data)=>{
        if(err){
            console.log(err);
            return res.status(500).send('Error reading file');
        }
        res.send(data);
    })
}
module.exports.loginPage = async (req,res) => {
  fs.readFile('./frontend/studentLogin.html','utf8',(err,data)=>{
   res.send(data);
  })
}
module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/student/login");
}

module.exports.studentDashboard = (req,res)=>{
    fs.readFile('./frontend/studentDashboard.html','utf-8',(err,data)=>{
        if(err){
            console.log(err);
            return res.status(500).send('Error reading file');
        }
        res.send(data);
    })
}