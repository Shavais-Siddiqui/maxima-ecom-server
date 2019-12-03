const express = require('express');
const router = express.Router();
const UserController = require('./controllers/userController');

router.post('/user-exists', (req, res, next) => {
    UserController.add(req, res, next);
});

module.exports = router;