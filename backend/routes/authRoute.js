const express = require('express');
const { loginUser } = require('../controller/authController.js');
const router = express.Router();

router.post('/login', loginUser);

module.exports = router;