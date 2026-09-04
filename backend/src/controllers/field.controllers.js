const User = require('../models/user.model');
const Task = require('../models/task.model');

//1)post /api/user/register
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


//2)post /api/user/login
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

//3)POST /admin/create-task
const createTask = async (req, res) => {
    try {
        const { employee, priority,status ,empId} = req.body;

        const newTask = new Task({ employee, priority, status , empId});
        await newTask.save();

        res.status(200).json({
            msg: 'task created successfully',
            task: newTask
        });
    } catch (error) {
        res.status(500).json({ msg: 'creation failed', error: error.message });
    }
}

//3)POST /admin/create-task
const createComplain = async (req, res) => {
    try {
        const { title, description, location, dueDate} = req.body;

        const newTask = new Task({ title, description,location, dueDate,});
        await newTask.save();

        res.status(200).json({
            msg: 'task created successfully',
            task: newTask
        });
    } catch (error) {
        res.status(500).json({ msg: 'creation failed', error: error.message });
    }
}

//4)GET /all-employee
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

//5)GET /all-task
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

//6) PATCH /update-loc
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


//7)PATCH /status/:id
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

//8)DELETE /del/:id
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

//9)DELETE /del-task/:id
const delTask = async(req,res) => {
    try{
        const taskId = req.params;

        const index = await Task.findByIdAndDelete(taskId.id);

        return res.status(200).json({msg : "task deletion successful"});
    }catch(error){
        return res.status(404).json({msg : error});
    }
}

//10)PATCH /update-emp/:id
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

//11)PATCH /update-name/:id
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


//12)GET /me/:id
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

//13) GET /task/:id
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

//14)GET /myTask/:id
const myTask = async(req,res) => {
    try{
        const emId = req.params;
        console.log(emId);

        const task = await Task.find({empId : {$eq : emId.id}});
        console.log(task);

        if(!task){
            return res.status(400).json({msg : "no task is assigned"});
        }

        return res.status(200).json({msg : "all assigned tasks : ",task});
    }catch(error){
        console.log(error);
        return res.status(404).json({msg : error});
    }
}

//15)PATCH /evedince/:id
const postEvidence = async(req,res) => {
    try{
        const taskId = req.params;
        console.log(taskId.id);
        // console.log(taskId);
        const {evidence} = req.body;
        console.log(evidence);

        const task = await Task.findByIdAndUpdate(
            taskId.id,
            {
                evidence : evidence,
            },
            {
                returnDocument : 'after',
                runValidators : true,
            }
        );

        if(!task){
            return res.status(400).json({msg : "task not found"});
        }

        return res.status(200).json({msg : "evidence update successfully " , task});
    }catch(error){
        return res.status(400).json({msg : error});
    }
}

//16)PATCH /accept/:id
const updateAccept = async(req,res) => {
    try{
        const taskId = req.params;
        console.log(taskId);

        const task = await Task.findByIdAndUpdate(
            taskId.id,
            {
                accept : true,
                status : "Pending"
            },
            {
                returnDocument : 'after',
                runValidators : true
            }
        );
        console.log(task);

        if(!task){
            return res.status(400).json({msg : "task not found"})
        }
        return res.status(200).json({msg : "accept updated successfully" , task})
    }catch(error){
        return res.status(404).json({msg : error});
    }
}

//17)PATCH /task-update/:id
const updateTask = async(req,res) => {
    try{
        const taskId = req.params;
        console.log(taskId);
        const status = typeof req.body === 'object' && req.body.status ? req.body.status : (typeof req.body === 'string' ? req.body : req.body.status);

        const task = await Task.findByIdAndUpdate(
            taskId.id,
            {
                status : status || req.body
            },
            {
                returnDocument : 'after',
                runValidators : true
            }
        );
        console.log(task);

        if(!task){
            return res.status(400).json({msg : "task not found"})
        }
        return res.status(200).json({msg : "status updated successfully" , task})
    }catch(error){
        return res.status(404).json({msg : error});
    }
}

//18) PATCH /reject/:id
const rejectTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const task = await Task.findByIdAndUpdate(
            id,
            {
                accept: false,
                status: 'Rejected',
                rejectReason: reason || 'Rejected by employee'
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!task) {
            return res.status(400).json({ msg: 'task not found' });
        }
        return res.status(200).json({ msg: 'task rejected successfully', task });
    } catch (error) {
        return res.status(500).json({ msg: 'server error', error: error.message });
    }
};

//19) PATCH /cancel/:id
const cancelTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const task = await Task.findByIdAndUpdate(
            id,
            {
                status: 'Cancelled',
                cancelReason: reason || 'Cancelled by employee'
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!task) {
            return res.status(400).json({ msg: 'task not found' });
        }
        return res.status(200).json({ msg: 'task cancelled successfully', task });
    } catch (error) {
        return res.status(500).json({ msg: 'server error', error: error.message });
    }
};

//20) POST /logout
const logoutUser = async (req, res) => {
    try {
        return res.status(200).json({ msg: 'Logged out successfully' });
    } catch (error) {
        return res.status(500).json({ msg: 'server error', error: error.message });
    }
};

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
    getTask,
    myTask,
    postEvidence,
    updateAccept,
    updateTask,
    rejectTask,
    cancelTask,
    logoutUser,
    createComplain
};
