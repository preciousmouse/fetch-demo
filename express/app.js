var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
process.env.host = 'http://127.0.0.1';
// allow cors to all origins
// app.use(cors());
//enable all cors pre-flight(complex cors request)
// app.options('*', cors())
//
var whitelist = [
	'http://127.0.0.1:'+process.env.PORT.replace(/(\s*$)/g,""),
	'http://localhost:'+process.env.PORT.replace(/(\s*$)/g,""),//去除尾部空格
	'http://project.com', 
	'http://example.com'
];
var corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},
	credentials: true,
}
app.use(cors(corsOptions));

app.use(session({
	name: 'account',
	secret: 'pssecret',
	saveUninitialized: false,
	resave: true,
	cookie: {
		maxAge: 1000*60*5,
	}
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
