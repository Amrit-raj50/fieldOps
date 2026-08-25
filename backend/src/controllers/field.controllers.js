const User = require('../models/user.model');

//post /api/register
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

module.exports = createUser;