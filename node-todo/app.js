const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const router = require('./router/router');

const app = express();

app.use(bodyParser.json());
app.use(logger('dev'));

router(app);


module.exports = app;

