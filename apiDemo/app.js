var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var app = express()
var port = process.env.PORT || 3000;


/* 格式化body中的内容, */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser())
app.use(session({
    secret: 'technode',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000
    },
    //store: sessionStore
}))

app.use(express.static(__dirname + '/static'))

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/static/index.html')
})


/* 测试登录 */
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var secret = 'shhhhhhared-secret';
// We are going to protect /api routes with JWT
//app.use('/api', expressJwt({secret: secret})); // todo `secret` 哪里来的？

// app.use(express.json());
// app.use(express.urlencoded());

//角通过AJAX应用程序将执行用户的凭证:
app.post('/authenticate', function (req, res) {
  //TODO validate req.body.username and req.body.password
  //if is invalid, return 401
  if (!(req.body.username === 'john.doe' && req.body.password === 'foobar')) {
    res.send(401, 'Wrong user or password');
    return;
  }

  var profile = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@doe.com',
    id: 123
  };

  // We are sending the profile inside the token
  var token = jwt.sign(profile, secret, { expiresInMinutes: 60*5 });

  res.json({ token: token });
});

app.post('/login', function (req, res) {
  

  var profile = {
    user: {
        role: 'admin',
        id: 'bert'
    }, 
    role: 'all',
    name: 'bert',
    id: 1231
  };

  // We are sending the profile inside the token
  var token = jwt.sign(profile, secret, { expiresInMinutes: 60*5 });

  res.json(profile);
});

//得到一个资源命名/ api /限制是直接的。注意,执行的凭证检查expressJwt中间件。
app.get('/api/restricted', function (req, res) {
  console.log('user ' + req.user + ' is calling /api/restricted');
  res.json({
    name: 'foo'
  });
});

app.get('/api/permissionService', function(req, res) {
    console.log('测试是否有效，没有返回user信息会报错嘛？');
    res.json({
        // name: 'bert',
        // pwd: '123456',
        // role: 2,
        // isAdministrator: true
    })
})


/* 测试登录 end */
app.listen(port, function(req, res) {
    console.log('Sonneteck is on port ' + port + '!')
})
