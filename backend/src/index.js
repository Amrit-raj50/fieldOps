const connectDB = require('./config/db.js');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

connectDB();
app.get('/',(req,res) => {
    res.send("server is running!");
})

app.listen(3000 , () => {
    console.log("server is runnning on the post 3000");
})