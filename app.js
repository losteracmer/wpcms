var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('./routes/validation'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login',require('./routes/login'));

app.use('/index',require('./routes/index'));

app.use('/labour',require('./routes/labour'));

app.use('/customer',require('./routes/customer'));

app.use('/machine',require('./routes/machine'));

app.use('/sales',require('./routes/sales'));

app.use('/accessories',require('./routes/accessories'));

app.use('/analysis',require('./routes/analysis'));

app.use('/app',require('./routes/wpcms_app'));
// 未发现路由
app.use(function(req, res, next) {
  console.log('##########非访问:',req.url);
  res.redirect("/error-404.html");
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.listen(3000,function(error){
//   if(error){
//     console.log('监听错误')

//   }else {
//     console.log("正在监听3000");
    
//   }
// })
module.exports = app;
