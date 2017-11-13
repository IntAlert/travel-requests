var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
var cookieSession = require('cookie-session');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieSession({
  name: 'alert-travel-requests',
  keys: [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2, process.env.COOKIE_KEY_3]
}));

// load Auth
var auth = require('./routes/auth');
auth(app);

app.use('/api/', require('./routes/index'));
app.use('/api/travel_requests/create', require('./routes/travel_requests/create'));
app.use('/api/travel_requests/read', require('./routes/travel_requests/read'));
app.use('/api/travel_requests/update', require('./routes/travel_requests/update'));
app.use('/api/travel_requests/remove', require('./routes/travel_requests/remove'));
app.use('/api/travel_requests/list', require('./routes/travel_requests/list'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
