const express = require('express');
const router = express.Router();
const UserController = require('./controllers/userController');

router.get('/test', (req, res) => {
    res.send('Server Is Running!');
});

router.post('/check-social-login', UserController.verify);
router.post('/add-user', UserController.register);
router.post('/login', UserController.login);
router.post('/verify-email/:id', UserController.emailVerification);



module.exports = router;