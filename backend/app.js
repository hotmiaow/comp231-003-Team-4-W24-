var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const url = "mongodb+srv://ectablerev:Comp231_group4@cluster0.vcbnpu8.mongodb.net/";
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


mongoose.connect(url)
.then(()=>console.log('database connect successful'))
.catch(e=>console.log(e.mesage));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;

app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
});

