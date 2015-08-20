var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var exphbs  = require('express-handlebars');

//mongodb
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodeme');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 3000);
app.engine('html', exphbs({
  layoutsDir: 'views',
  defaultLayout: 'layout',
  extname: '.html'
}));
// layoutsDir: 'views'： 设置布局模版文件的目录为 views 文件夹
// defaultLayout: 'layout'： 设置默认的页面布局模版为 layout.html 文件
// extname: '.html'： 模版文件使用的后缀名，这个 .hbs 是我们自定的，我们当然可以使用 .html 和 .handlebars 等作为后缀，只需把以上的 hbs 全部替换即可。
app.set('view engine', 'html');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('world'));
app.use(session({ secret: 'world'})); //这句话一定要写在 app.use('/', routers)前面！！
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
// MUST above at app.use('/', routes);
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
