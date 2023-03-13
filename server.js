const express=require('express');
const app=express();
const mysql=require('mysql2');
const bodyParser=require('body-parser');
const fs=require('fs');
const cors=require('cors');
require('dotenv').config()
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
const port=process.env.PORT;

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

app.post('/newStudent',(req,res)=>{
    const id=req.body.id;
    const name=req.body.name;
    const email=req.body.email;
    const sqlInsert=`INSERT INTO students (id,name,email) VALUES ('${id}','${name}','${email}')`;
    conn.query(sqlInsert,(err,res)=>{
        if(err) throw err;
        console.log("Insertion successful");
        return res;
    })

})

app.get('/getStudentByID',(req,res)=>{
    const id=req.id;
    const sqlSelect=`SELECT * FROM students WHERE id=${id}`;
    conn.query(sqlSelect,(err,result)=>{
        if(err) throw err;
        console.log(result);
    });
});


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
