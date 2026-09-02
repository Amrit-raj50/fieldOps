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
    myTask
} = require('../controllers/field.controllers');

router.post('/register',createUser);
router.post('/login',loginUser);
router.post('/admin/create-task',createTask);

router.get('/all-employee' , allEmployee);
router.get('/all-task', allTask);
router.get('/me/:id' , profile);
router.get('/task/:id' , getTask);
router.get('/myTask/:id' , myTask);

router.patch('/update-loc/:id', updateLoc);
router.patch('/status/:id' , updateStatus);
router.patch('/update-emp/:id' , updateEmp);
router.patch('/update-name/:id' , updateName);

router.delete('/del/:id' , delEmp);
router.delete('/del-task/:id' , delTask);

module.exports = router;