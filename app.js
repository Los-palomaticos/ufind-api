//config dotenv
require('dotenv').config()

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var apiRouter = require('./routes/api');

var app = express();
app.use(cors())
// configurar cloudinary
require('./config/cloudinary.config');

// connectar base de datos
const {connect} = require('./config/mysql.config');
connect()
require('./test')

// crear tablas
//corer una vez y luego comentar
require('./config/createDB.config')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// router
app.use('/api', apiRouter);

module.exports = app;
