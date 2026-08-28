const express = require('express');
const router = express.Router();

const createUser = require('../controllers/field.controllers');
const loginUser = require('../controllers/field.controllers');

router.post('/register',createUser);
router.post('/login',loginUser);

module.exports = router;