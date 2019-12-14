const UserModel = require('../models/user');
const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');
const request = require('request');
const passwordUtils = require('../utils/passwordHash');
const nodemailer = require("nodemailer");
const VerificationModel = require('../models/email-verification');

// https://graph.facebook.com/me?access_token=
// https://oauth2.googleapis.com/tokeninfo?id_token=

const userActions = {
  verify: asyncMiddleware(async (req, res) => {
    console.log(req.body);
    if (req.body.provider === 'GOOGLE') {

      request('https://oauth2.googleapis.com/tokeninfo?id_token=' + req.body.idToken, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body);   Print the HTML for the Google homepage.

        let data = {
          token: 'sdjsjdhsd87dksndsd',
          verfied: true
        };

        res.status(status.success.accepted).json({
          message: 'Verified',
          data
        });
      });

    } else if (req.body.provider === 'FACEBOOK') {

      request('https://graph.facebook.com/me?access_token=' + req.body.authToken, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body);   Print the HTML for the Google homepage.

        let data = {
          token: 'sdjsjdhsd87dksndsd',
          verfied: true
        };

        res.status(status.success.accepted).json({
          message: 'Verified',
          data
        });
      });

    }
  }),

  register: asyncMiddleware(async (req, res) => {
    let user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      res.status(status.client.badRequest).json({
        message: 'Email Already Exists'
      });
    } else {
      // Save new user to db
      let hashedPassword = await passwordUtils.hashPassword(req.body.password);
      let newUser = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      });
      let savedUser = await newUser.save();
      if (savedUser) {

        // Send Verification Mail
        let smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "ayazhussainbs@gmail.com",
            pass: "codedecoder"
          }
        });

        let rand = Math.floor((Math.random() * 100) + 54);

        console.log('Rand', rand);
        console.log('Host:', req.get('host'));
        let link = "https://maximaecommerceclient.herokuapp.com" + "/verification?key=" + savedUser.id + rand;
        console.log(link);
        let mailOptions = {
          from: 'ayazhussainbs@gmail.com',
          to: req.body.email,
          subject: "Please confirm your Email account to continue with Ecommerce",
          html: "Hello" + savedUser.name + "<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
        };
        let sentMail = await smtpTransport.sendMail(mailOptions);
        console.log(sentMail);

        // Remove Password From Object
        let addedUser = savedUser.toObject();
        delete addedUser.password;
        res.status(status.success.created).json({
          message: 'User Created Successfully',
          data: addedUser
        });
      }
    }
  }),

  emailVerification: asyncMiddleware(async (req, res) => {
    let id = req.params.id;
    let userId = id.slice(0, 24);
    console.log(id);
    let verification = await VerificationModel.findOne({ userId: userId });
    if (verification.token == req.params.id) {
      let user = await VerificationModel.findOneAndUpdate(userId, {
        active: true
      });
      if (user) {
        res.status(status.success.accepted).json({
          message: 'Approved',
          data: user
        });
      }
    } else {
      res.status(status.client.badRequest).json({
        message: 'Disapproved'
      });
    }
  }),

  login: asyncMiddleware(async (req, res) => {
    console.log(req.body);
    let user = await UserModel.findOne({ email: req.body.email }).select('+password');
    if (user) {
      console.log(user);
      let verified = await passwordUtils.comparePassword(req.body.password, user.password);
      if (verified) {
        let loggedUser = user.toObject();
        delete loggedUser.password;
        res.status(status.success.accepted).json({
          message: 'Logged In Successfully',
          data: loggedUser
        });
      } else {
        res.status(status.client.badRequest).json({
          message: 'Wrong Password'
        });
      }
    } else {
      res.status(status.client.notFound).json({
        message: 'User Not Found'
      });
    }
  })
};


module.exports = userActions;
