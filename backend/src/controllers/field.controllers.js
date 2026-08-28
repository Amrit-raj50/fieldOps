const User = require('../models/user.model');
const Task = require('../models/task.model');

//post /api/user/register
const createUser = async(req,res) => {
    try{
        const {name , email , password} = req.body;

        const newUser = new User({name , email , password });
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
        const {email , password , role} = req.body;

        const user = await User.findOne({email});
        console.log(user);

        if(!user){
            return res.status(401).json({
                message : "invalid email or password"
            })
        }

        if(user.role !== role){
            return res.status(401).json({
                message : "invalid role"
            })
        }

        if(user.password !== password){
            return res.status(401).json({
                message : "invalid password or email"
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

//POST /admin/create-task
const createTask = async(req,res) => {
    try{
        const {title , description , employee , priority , location , dueDate , status} = req.body;

        const newTask = new Task({title , description , employee , priority , location , dueDate , status});
        await newTask.save();

        res.status(200).json({
            msg : 'task created successfully',
            task : newTask
        });
    }catch(error){
        res.status(500).json({msg : 'creation failed', error : error.message});
    }
}

//GET /all-employee
const allEmployee = async(req,res) => {
    try{
        const employee = await User.find({role : 'employee'});

        if(!employee){
            return res.status(401).json({
                mes : 'no employee found'
            })
        }

        return res.status(200).json({
            success : true,
            data : employee
        });
    }catch(error){
        return res.status(404).json({message: 'server error', error});
    }
}

module.exports = {createUser,loginUser,createTask,allEmployee};