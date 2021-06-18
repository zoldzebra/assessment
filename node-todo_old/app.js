const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const router = require('./router/router');
const services = require('./services/services');

const app = express();

app.use(bodyParser.json());
app.use(logger('dev'));

router(app);
services.loadDbToCache();

module.exports = app;

