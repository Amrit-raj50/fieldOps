const User = require('../models/user.model');

//post /api/user/register
const createUser = async(req,res) => {
    try{
        const {name , email , password} = req.body;

        const newUser = new User({name , email , password});
        await newUser.save();

        res.status(201).json({
            msg : 'User successfully registered.',
            user : newUser,
        });
    } catch(error) {
        res.status(500).json({msg : 'server error.', error : error.message});
    }
}


//post /api/user/login
const loginUser = async(req,res) => {
    try{
        const {email , password} = req.body;

        const user = await User.findOne({email , password});

        if(!user){
            return res.status(401).json({
                message : "invalid email or password"
            })
        }

        return res.status(200).json({
            message:"login successful",
            user
        });

    }catch(error){
        res.status(500).json({
            message:"login failed",
            error : error.message
        })
    }
}

module.exports = {createUser,loginUser};