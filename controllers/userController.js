const UserModel = require('../models/user');
const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');
const request = require('request');
// https://graph.facebook.com/me?access_token=
// https://oauth2.googleapis.com/tokeninfo?id_token=

// res.status(status.server.serviceUnavailable).json({
//   message: 'Success'
// });
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
          message: 'Success',
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
          message: 'Success',
          data
        });
      });

    }
  })
};

module.exports = userActions;
