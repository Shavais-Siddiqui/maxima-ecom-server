const express = require('express');
const router = express.Router();
const UserController = require('./controllers/userController');
const jwt = require('./utils/jwt');

router.get('/test', jwt.verifyJwt, (req, res) => {
    res.send('Server Is Running!');
});

router.post('/check-social-login', UserController.verify);
router.post('/add-user', UserController.register);
router.post('/login', UserController.login);
router.post('/verify-email/:id', UserController.emailVerification);
// router.post('/testMail', UserController.testMail);
// router.post('/testJwt', UserController.testJwt);
router.get('/get-data', jwt.verifyJwt, UserController.getData);



module.exports = router;