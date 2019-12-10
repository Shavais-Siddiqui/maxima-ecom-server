const express = require('express');
const router = express.Router();
const UserController = require('./controllers/userController');

router.post('/check-social-login', UserController.verify);

module.exports = router;