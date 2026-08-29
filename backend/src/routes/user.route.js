const express = require('express');
const router = express.Router();

const {createUser,loginUser,createTask,allEmployee,allTask} = require('../controllers/field.controllers');

router.post('/register',createUser);
router.post('/login',loginUser);
router.post('/admin/create-task',createTask);

router.get('/all-employee' , allEmployee);
router.get('/all-task', allTask);

module.exports = router;