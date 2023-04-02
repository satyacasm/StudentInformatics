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

app.use('/admin',adminAuthRoutes);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);
