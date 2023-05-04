//config dotenv
require('dotenv').config()


var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var apiRouter = require('./routes/api');

var app = express();

// configurar cloudinary
require('./config/cloudinary.config');

// connectar base de datos
const {connect} = require('./config/mysql.config');
connect()

// crear tablas
require('./config/createDB.config')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// router
app.use('/api', apiRouter);

module.exports = app;
