const mongoose = require('mongoose');
const jsonConfig = require('../config/config.json');

function initialize(env) {
  let config = jsonConfig[env];
  mongoose.connect(config.db, { useNewUrlParser: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log('We are connected!');
  });
}
module.exports = {
  initialize
};