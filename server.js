const express=require('express');
const app=express();
const dotenv=require('dotenv');
const port=3000;
const mysql=require('mysql2');
const conn=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"7125"
});
conn.connect((err)=>{
    if(err) throw err;
    console.log("Connected to MySQL Server");
})
conn.query("USE sonoo",function(err,result){
    if(err) throw err;
    console.log("Using database sonoo");
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
