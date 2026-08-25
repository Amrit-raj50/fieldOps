
const express = require('express');

const app = express();

app.get('/',(req,res) => {
    res.send("server is running!");
})

app.listen(3000 , () => {
    console.log("server is runnning on the post 3000");
})