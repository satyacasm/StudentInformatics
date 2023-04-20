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

module.exports.login = (req,res) => {
    const { id, password } = req.body;
    if(!id || !password){
        res.status(400).json({msg: 'Please enter all fields'});
    }
    conn.query("SELECT * FROM students WHERE id = ?",[id],async function(err,result){
      if(err) throw err;
      if(result.length==0){
        return res.status(400).json({msg: 'User does not exist'});
      }
      
        const isMatch = password==result[0].password;
        if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
        }
        // Sign JWT token and set cookie
        const token = jwt.sign({ id: result[0].id }, config.get('jwtsecret'), { expiresIn: '1h' });
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
        // res.send("Logged in")
        res.redirect('/student/dashboard');
    

    })
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
module.exports.logout = (req, res) => {
    res.clearCookie('jwt');
  //   res.json({ msg: 'Logged out' });
      // req.flash('Logged Out', 'You are successfully logged out')
    res.redirect('/');
}
