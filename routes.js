const express = require('express');
const router = express.Router();
const UserController = require('./controllers/userController');

router.get('/test', (req, res) => {
    res.send('Server Is Running!');
});

router.post('/check-social-login', UserController.verify);

module.exports = router;