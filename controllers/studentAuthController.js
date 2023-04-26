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
  // console.log(req.body); 
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
        console.log(req.user);
        res.send(data);
    })
}

module.exports.courseRegister = (req,res)=>{
    fs.readFile('./frontend/courseRegister.html','utf-8',(err,data)=>{
        if(err){
            console.log(err);
            return res.status(500).send('Error reading file');
            // conn.query(`SELECT * FROM STUDENTS WHERE sem=`)
            
        }
        console.log(req.body);
        conn.query(`select * from course where sem=(select sem from students where id=${req.user.id}) and dept=(select dept from students where id=${req.user.id} and mandatory=1)`,(error,result)=>{
            if(error) throw error;
            // console.log(result);
            let html='';
            result.forEach((course) => {
              html+=`<label for="mandatory"><input type="checkbox" name="mandatory" value="${course.coursecode}" checked disabled>${course.coursename}</input></label><br></br>`;
              html+=`<input type="hidden" name="mandatory" value="${course.coursecode}">`
            })
            const ans1=data.replace(/%mandatory%/g,html);
            conn.query(`select * from course where sem=(select sem from students where id=${req.user.id}) and dept=(select dept from students where id=${req.user.id} and mandatory=0)`,(error1,result1)=>{
                if(error1) throw error1;
                let html1='';
                result1.forEach((course) => {
                  html1+=`<label for="optional"><input type="checkbox" name="optional" value="${course.coursecode}" checked disabled>${course.coursename}</input></label><br></br>`;
                })

                const ans2=ans1.replace(/%nonmandatory%/g,html1);
                // console.log(ans2);
                res.send(ans2);
            });
        })
        // console.log(req.user);
        // res.send(data);
    })
}

module.exports.registerCourse = (req,res)=>{
  console.log(req.body);
  res.send(req.body)
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