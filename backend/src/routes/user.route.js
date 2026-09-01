const express = require('express');
const router = express.Router();

const {createUser,loginUser,createTask,allEmployee,allTask , updateLoc , delEmp ,updateStatus} = require('../controllers/field.controllers');

router.post('/register',createUser);
router.post('/login',loginUser);
router.post('/admin/create-task',createTask);

router.get('/all-employee' , allEmployee);
router.get('/all-task', allTask);

router.patch('/update-loc/:id', updateLoc);
router.patch('/status/:id' , updateStatus);

router.delete('/del/:id' , delEmp);

module.exports = router;