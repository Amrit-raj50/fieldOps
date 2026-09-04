const express = require('express');
const router = express.Router();

const {
    createUser,
    loginUser,
    createTask,
    allEmployee,
    allTask , 
    updateLoc , 
    delEmp ,
    updateStatus , 
    delTask ,
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
    createComplain,
    allComplains,
    assignComplain
} = require('../controllers/field.controllers');

router.post('/register',createUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);
router.post('/admin/create-task',createTask);
router.post('/admin/create-complain',createComplain);

router.get('/all-employee' , allEmployee);
router.get('/all-task', allTask);
router.get('/all-complains', allComplains);
router.get('/me/:id' , profile);
router.get('/task/:id' , getTask);
router.get('/myTask/:id' , myTask);

router.patch('/update-loc/:id', updateLoc);
router.patch('/status/:id' , updateStatus);
router.patch('/update-emp/:id' , updateEmp);
router.patch('/update-name/:id' , updateName);
router.patch('/update-evidence/:id',postEvidence);
router.patch('/accept/:id',updateAccept);
router.patch('/reject/:id',rejectTask);
router.patch('/cancel/:id',cancelTask);
router.patch('/task-update/:id',updateTask);
router.patch('/assign-complain/:id', assignComplain);


router.delete('/del/:id' , delEmp);
router.delete('/del-task/:id' , delTask);

module.exports = router;
