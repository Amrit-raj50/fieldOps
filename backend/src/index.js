const connectDB = require('./config/db.js');
const app = require('./app.js')
const dotenv = require('dotenv');

dotenv.config();

const startServer = async() => {
    try{
        await connectDB();
        app.listen(3000 , () => {
            console.log("server is running");
        })
    }catch(error){
        console.log('server is not running:',error.message);
    }
}


startServer();
// connectDB();
// app.get('/',(req,res) => {
//     res.send("server is running!");
// })

// app.listen(3000 , () => {
//     console.log("server is runnning on the post 3000");
// })