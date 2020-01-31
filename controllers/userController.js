const UserModel = require('../models/user');
const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');
const request = require('request');
const passwordUtils = require('../utils/passwordHash');
const nodemailer = require("nodemailer");
const VerificationModel = require('../models/email-verification');
const jwt = require('../utils/jwt');

// https://graph.facebook.com/me?access_token=
// https://oauth2.googleapis.com/tokeninfo?id_token=

const userActions = {
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
        password: hashedPassword,
        provider: 'MAIL'
      });
      let savedUser = await newUser.save();
      if (savedUser) {
        // Send Verification Mail
        let smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          port: 465,
          auth: {
            user: "maximaecommerce12@gmail.com",
            pass: "coders123"
          }
        });

        let rand = Math.floor((Math.random() * 1000) + 55);
        let link = "https://maximaecommerceclient.herokuapp.com" + "/verification?key=" + savedUser.id + rand;
        console.log(link);
        let mailOptions = {
          from: 'maximaecommerce12@gmail.com',
          to: req.body.email,
          subject: "Please confirm your Email account to continue with Ecommerce",
          html: "Hello" + ' ' + savedUser.name + "<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
        };
        let sentMail = await smtpTransport.sendMail(mailOptions);
        console.log(sentMail);

        // Save Token In The Db
        let verification = new VerificationModel({
          userId: savedUser.id,
          token: savedUser.id + rand
        });
        await verification.save();

        // Remove Password From Object
        let addedUser = savedUser.toObject();
        delete addedUser.password;
        res.status(status.success.created).json({
          message: 'User Created Successfully',
          data: addedUser,
          token: 'Bearer ' + await jwt.signJwt({ id: savedUser.id })
        });
      }
    }
  }),

  emailVerification: asyncMiddleware(async (req, res) => {
    let id = req.params.id;
    let userId = id.slice(0, 24);
    let verification = await VerificationModel.findOne({ userId: userId });
    if (verification.token == req.params.id) {
      console.log('verified');
      await VerificationModel.findByIdAndRemove(verification.id);
      let user = await UserModel.findByIdAndUpdate(userId, {
        active: true
      }, { new: true });
      if (user) {
        res.status(status.success.accepted).json({
          message: 'Approved',
          data: user,
          token: 'Bearer ' + await jwt.signJwt({ id: user.id })
        });
      }
    } else {
      res.status(status.client.badRequest).json({
        message: 'Disapproved'
      });
    }
  }),

  login: asyncMiddleware(async (req, res) => {
    switch (req.body.provider) {
      case 'MAIL':
        let user = await UserModel.findOne({ email: req.body.email }).select('+password').populate('cart.productId').populate('wishlist');
        if (user) {
          console.log(user);
          let verified = await passwordUtils.comparePassword(req.body.password, user.password);
          if (verified) {
            let loggedUser = user.toObject();
            delete loggedUser.password;
            res.status(status.success.accepted).json({
              message: 'Logged In Successfully',
              data: loggedUser,
              token: 'Bearer ' + await jwt.signJwt({ id: user.id })
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
        break;
      case 'GOOGLE':

        request('https://oauth2.googleapis.com/tokeninfo?id_token=' + req.body.idToken, async function (error, response, body) {
          console.log('error:', error); // Print the error if one occurred
          console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          // console.log('body:', body);   Print the HTML for the Google homepage.

          if (response.statusCode == 200) {
            let user = await UserModel.findOne({ email: req.body.email }).populate('cart.productId').populate('wishlist');
            if (user) {
              res.status(status.success.accepted).json({
                message: 'Already Exists',
                data: user,
                token: 'Bearer ' + await jwt.signJwt({ id: user.id })
              });
            } else {
              let newUser = new UserModel({
                name: req.body.name,
                email: req.body.email,
                provider: 'GOOGLE',
                active: true,
                imageUrl: req.body.photoUrl
              });
              let user = await newUser.save();
              res.status(status.success.created).json({
                message: 'Verified',
                data: user,
                token: 'Bearer ' + await jwt.signJwt({ id: user.id })
              });
            }
          } else {
            res.status(status.client.unAuthorized).json({
              message: 'Un-Authorized Login',
            });
          }
        });
        break;
      case 'FACEBOOK':
        request('https://graph.facebook.com/me?access_token=' + req.body.authToken, async function (error, response, body) {
          console.log('error:', error); // Print the error if one occurred
          console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          // console.log('body:', body);   Print the HTML for the Google homepage.

          if (response.statusCode == 200) {
            let user = await UserModel.findOne({ email: req.body.email }).populate('cart.productId').populate('wishlist');
            if (user) {
              res.status(status.success.accepted).json({
                message: `Welcome Again ${user.name}!`,
                data: user,
                token: 'Bearer ' + await jwt.signJwt({ id: user.id })
              });
            } else {
              let newUser = new UserModel({
                name: req.body.name,
                email: req.body.email,
                provider: 'FACEBOOK',
                active: true,
                imageUrl: req.body.photoUrl
              });
              let user = await newUser.save();
              res.status(status.success.created).json({
                message: `Welcome ${user.name}`,
                data: user,
                token: 'Bearer ' + await jwt.signJwt({ id: user.id })
              });
            }
          } else {
            res.status(status.client.unAuthorized).json({
              message: 'Un-Authorized Login',
            });
          }
        });
    }
  }),

  getData: asyncMiddleware(async (req, res) => {
    let user = await UserModel.findById(req.decoded.id).populate('cart.productId').populate('wishlist');
    if (user) {
      res.status(status.success.accepted).json({
        message: 'User Data',
        data: user
      });
    } else {
      res.status(status.client.notFound).json({
        message: 'User Not Found'
      });
    }
  }),

  update: asyncMiddleware(async (req, res) => {
    let user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (user) {
      res.status(status.success.created).json({
        message: 'User Updated Successfully'
      });
    } else {
      res.status(status.client.badRequest).json({
        message: 'Something Went Wrong While Updating User'
      });
    }
  }),

  getTest: asyncMiddleware(async (req, res) => {
    let user = await UserModel.findById('5e294e40ef91fa00170b57f0');
    res.json({
      user
    })
  })

};

module.exports = userActions;