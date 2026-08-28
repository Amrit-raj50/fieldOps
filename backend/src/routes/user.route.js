const express = require('express');
const router = express.Router();

const {createUser,loginUser,createTask,allEmployee} = require('../controllers/field.controllers');

router.post('/register',createUser);
router.post('/login',loginUser);
router.post('/admin/create-task',createTask);

router.get('/all-employee' , allEmployee);

module.exports = router;