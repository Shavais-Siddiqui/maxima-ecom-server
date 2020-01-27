const express = require('express');
const app = express();
const config = require('./config/configuration');
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'development';
const routes = require('./routes');
const cors = require('cors');
const statusCodes = require('./utils/statusCodes');
config.initialize(environment);

// Allowing CORS
app.use(cors());

// Body Parser For Parsing The Request Body
app.use(express.json({limit: '50mb', extended: true }));

// All Api End Points Should Start With '/api'
app.use('/api', routes);

// Express Error Handler
app.use(function (err, req, res, next) {
  console.log('Error Occured');
  res.status(statusCodes.client.badRequest).json({
    status: 'Failure',
    message: err.message
  });
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));