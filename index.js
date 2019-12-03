const express = require('express');
const app = express();
const config = require('./config/configuration');
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'development';
const routes = require('./routes');

config.initialize(environment);

app.use('/api', routes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));