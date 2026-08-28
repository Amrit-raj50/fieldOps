const express = require('express');
const userRoutes = require('./routes/user.route');

const app = express();

app.use(express.json());

app.use('/api/user',userRoutes);


//route not found 404.
app.use((req,res) => {
    res.status(404).json({msg : "route not found"});
})

module.exports = app;