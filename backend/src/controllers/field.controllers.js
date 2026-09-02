const User = require('../models/user.model');
const Task = require('../models/task.model');

//post /api/user/register
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({
            msg: 'User successfully registered.',
            user: newUser,
        });
    } catch (error) {
        res.status(500).json({ msg: 'server error.', error: error.message });
    }
}


//post /api/user/login
const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const user = await User.findOne({ email });
        console.log(user);

        if (!user) {
            return res.status(401).json({
                message: "invalid email or password"
            })
        }

        if (user.role !== role) {
            return res.status(401).json({
                message: "invalid role"
            })
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "invalid password or email"
            })
        }

        return res.status(200).json({
            message: "login successful",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "login failed",
            error: error.message
        })
    }
}

//POST /admin/create-task
const createTask = async (req, res) => {
    try {
        const { title, description, employee, priority, location, dueDate, status ,empId} = req.body;

        const newTask = new Task({ title, description, employee, priority, location, dueDate, status , empId});
        await newTask.save();

        res.status(200).json({
            msg: 'task created successfully',
            task: newTask
        });
    } catch (error) {
        res.status(500).json({ msg: 'creation failed', error: error.message });
    }
}

//GET /all-employee
const allEmployee = async (req, res) => {
    try {
        const employee = await User.find({ role: 'employee' });

        if (!employee) {
            return res.status(401).json({
                mes: 'no employee found'
            })
        }

        return res.status(200).json({
            success: true,
            data: employee
        });
    } catch (error) {
        return res.status(404).json({ message: 'server error', error });
    }
}

//GET /all-task
const allTask = async (req, res) => {
    try {
        const task = await Task.find();
        if (!task) {
            return res.status(401).json({
                mes: 'no task found',
            })
        }

        return res.status(200).json({
            success: true,
            data: task,
        })
    } catch (error) {
        return res.status(404).json({ message: 'server error', error });
    }
}

// PATCH /update-loc
const updateLoc = async (req, res) => {
    try {
        const { id } = req.params;
        const { latitude, longitude } = req.body;
        const user = await User.findByIdAndUpdate(
            id,
            {
                latitude: latitude,
                longitude: longitude,
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!user) {
            return res.status(401).json({
                msg: 'user not found'
            })
        }
        res.status(200).json({ msg: 'location updated', user });
    } catch (error) {
        res.status(500).json({ msg: 'update failed', error: error.message });
    }
}


//PATCH /status/:id
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const task = await Task.findByIdAndUpdate(
            id,
            {
                status : status
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!task) {
            return res.status(401).json({
                msg: 'task not found'
            })
        }
        res.status(200).json({ msg: 'status updated', task });
    } catch (error) {
        res.status(500).json({ msg: 'update failed', error: error.message });
    }
}

//DELETE /del/:id
const delEmp = async(req,res) => {
    try{
        const userId = req.params;
        // JSON.stringify(req.params);
        console.log(userId);
        const index = await User.findByIdAndDelete(userId.id);
        // console.log(index);

        // if(index === -1){
        //     return res.status(400).json({msg : "employee not found."});
        // }

        // User.splice(index,1);

        return res.status(200).json({msg : "employee removed from the database successfuly"});
    }catch(error){
        console.log(error);
        return res.status(404).json({msg : error});
    }
}

//DELETE /del-task/:id
const delTask = async(req,res) => {
    try{
        const taskId = req.params;

        const index = await Task.findByIdAndDelete(taskId.id);

        return res.status(200).json({msg : "task deletion successful"});
    }catch(error){
        return res.status(404).json({msg : error});
    }
}

//PATCH /update-emp/:id
const updateEmp = async (req, res) => {
    try {
        const { id } = req.params;
        const { empId } = req.body;
        const task = await Task.findByIdAndUpdate(
            id,
            {
                empId : empId
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!task) {
            return res.status(401).json({
                msg: 'task not found'
            })
        }
        res.status(200).json({ msg: 'employeeId  updated', task });
    } catch (error) {
        res.status(500).json({ msg: 'updation failed', error: error.message });
    }
}

//PATCH /update-name/:id
const updateName = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const task = await Task.findByIdAndUpdate(
            id,
            {
                name : name
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!task) {
            return res.status(401).json({
                msg: 'task not found'
            })
        }
        res.status(200).json({ msg: 'name  updated', task });
    } catch (error) {
        res.status(500).json({ msg: 'updation failed', error: error.message });
    }
}


//GET /me/:id
const profile = async(req,res) => {
    try{
        const userId = req.params;
        console.log(userId.id);

        const user = await User.findById(userId.id);
        console.log(user);

        if(!user){
            return res.status(400).json({msg : "user not found"});
        }

        console.log(user);
        return res.status(200).json({msg : "get current user",user});
    }catch(error){
        console.log(error);
        return res.status(404).json({msg : error});
    }
}

// GET /task/:id
const getTask = async(req,res) => {
    try{
        const taskId = req.params;
        const task = await Task.findById(taskId.id);

        if(!task){
            return res.status(400).json({msg : "task not found"})
        }

        return res.status(200).json({msg : "task found : " , task});
    }catch(error){
        return res.status(404).json({msg : error});
    }
}


module.exports = { 
    createUser, 
    loginUser, 
    createTask, 
    allEmployee, 
    allTask ,
    updateLoc , 
    delEmp , 
    updateStatus , 
    delTask, 
    updateEmp , 
    updateName , 
    profile,
    getTask
};