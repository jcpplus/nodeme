var express = require('express');
var router = express.Router();
var crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/error', function(req, res, next) {
    res.render('error', {
        title: 'Error',
        message: '这是一个错误的页面'
    });
});

router.get('/users', function(req, res, next) {
    res.render('users', {
        username: "hello, my nodejs!",
        title: 'Users'
    });
});


/**
 * [关于get与post]
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]}       [description]
 * @return {[type]}       [description]
 *
 * 再回过头看看GET和POST方式接收值，从直接效果上来看
　　req.query：我用来接收GET方式提交参数
　　req.body：我用来接收POST提交的参数
　　req.params：两种都能接收到
 */
router.get('/login', function(req, res, next) {
    res.render('login', {
        title: 'Login'
    });
});


router.post('/login', function(req, res, next) {
    var
        userName = req.body.tUserName,
        userPwd = req.body.tUserPwd,
        userName2 = req.param('tUserName'),
        userPwd2 = req.param('tUserPwd');

    console.log('req.body用户名：' + userName);
    console.log('req.body密码：' + userPwd);
    console.log('req.param用户名：' + userName2);
    console.log('req.param密码：' + userPwd2);

    res.render('login', {
        title: 'Login'
    });
});

/**
 * [加密字符串示例]
 * @param  {[type]} req  [description]
 * @param  {[type]} res) [description]
 * @return {[type]}      [description]
 */
router.get('/usecrypto', function(req, res) {

    res.render('usecrypto', {
        title: '加密字符串示例'
    });

});

router.post('/usecrypto', function(req, res) {
    var
        userName = req.body.tUserName,
        userPwd = req.body.tUserPwd;

    //生成口令的散列值
    var md5 = crypto.createHash('md5'); //crypto模块功能是加密并生成各种散列
    var en_upwd = md5.update(userPwd).digest('hex');

    console.log('加密后的密码:' + en_upwd);

    res.render('usecrypto', {
        title: '加密字符串示例'
    });
});

/**
 * session的例子
 * @param  {[type]} req   [description]
 * @return {[type]}       [description]
 */
router.get('/session', function(req, res, next) {
    if (req.session.islogin) {
        console.log('使用session的例子: ' + req.session.islogin);
        res.locals.islogin = req.session.islogin;
    }
    res.render('session', {
        title: '使用session的例子'
    });
});

router.post('/session', function(req, res, next) {
    req.session.islogin = 'success';
    res.locals.islogin = req.session.islogin;

    res.render('session', {
        title: '使用session示例'
    });
});


router.get('/cookies', function(req, res, next) {
    if (req.cookies.islogin) {
        console.log('usecookies-cookies:' + req.cookies.islogin);
        req.session.islogin = req.cookies.islogin;
    }

    res.render('cookies', {
        title: '使用cookies示例'
    });
});

router.post('/cookies', function(req, res, next) {
    req.session.islogin = 'success';
    res.locals.islogin = req.session.islogin;

    res.cookie('islogin', 'success', {
        maxAge: 60000
    });

    res.render('cookies', {
        title: '使用cookies示例'
    });
});

router.get('/readDB', function(req, res, next) {
    var db = req.db;
    var collection = db.get('nodeme');
    collection.find({}, {}, function(e, docs) {
        res.render('readDB', {
            'readDB': docs,
            title: '连接mongodb数据库'
        });
    });
});

router.get('/newuser', function(req, res, next) {
    res.render('newuser', {
        title: "向数据库中写入数据"
    })
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('nodeme');

    // Submit to the DB
    // 并没有做任何的校验
    collection.insert({
        "username": userName,
        "email": userEmail
    }, function(err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("readDB");
            // And forward to success page
            res.redirect("readDB");
        }
    });
});


/**
 * register注册页面
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} [description]
 * @return {[type]}       [description]
 */
router.get('/register', function(req, res, next) {
    res.render('register', {
        title: 'register'
    });
});

//TODO: session  cookies

module.exports = router;
