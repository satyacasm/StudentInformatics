const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const bodyParser=require('body-parser');
const fs=require('fs');
const app=express();
const cors=require('cors');
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static('frontend'));
const auth=require('./middleware/auth')
const mysql=require('mysql2');

require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: true }));


const dbURI = process.env.DB_URI;
const port = process.env.PORT || 3001;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then((res)=>console.log("Connected to MongoDB database"))
.catch((err)=>console.log("Error in connection to MongoDB"))

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

const adminAuthRoutes = require('./routes/adminAuth');
app.get('/admin/login',(req,res)=>{
    res.sendFile(__dirname +'/frontend/loginpage.html');
})
app.use('/admin',adminAuthRoutes);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);


//Temporary part to be replaced by dashboard page

app.get('/',auth,(req,res)=>{
    res.redirect('/admin/dashboard');
})
app.get('/admin/dashboard',auth,(req,res)=>{
    fs.readFile(__dirname+'/frontend/dashboard.html','utf8',(err,data)=>{
        if(err){
            console.log(err);
            return res.status(500).send('Error reading file');
        }
        console.log(req.user.name)
        const name = req.user.name;
        const result = data.replace(/%name%/g, name);
      
        // send the modified HTML to the client
        res.send(result);
    })
});