const express = require('express');
const router = express.Router();

const {createUser,loginUser,createTask} = require('../controllers/field.controllers');

router.post('/register',createUser);
router.post('/login',loginUser);
router.post('/admin/create-task',createTask);

module.exports = router;