const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const noteRouter = require('./routes/note');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/note', noteRouter);
app.use(express.static('./node_modules/jquery/dist'));
app.use(express.static('./node_modules/normalize.css/'));

module.exports = app;
