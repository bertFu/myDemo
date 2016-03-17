var express = require('express')
var app = express()
var port = process.env.PORT || 3000; //接收命令行启动参数用作服务器启动端口，没有参数则选择3000端口作为默认端口

/* 
    express.static 设置node的静态文件夹
    将所有的静态文件放在该文件夹下
 */
app.use(express.static(__dirname + '/static'))

/* 
    将static文件夹下的index.html作为整个应用的启动页面
    除静态文件请求外，其他所有的HTTP请求都将输出index.html文件
    服务器不关心路由，所有的路由逻辑都交给Angular.js处理
*/
app.use(function (req, res) {
    res.sendfile('./static/index.html')
})

var io = require('socket.io').listen(app.listen(port))

/*
    服务器端监听connection事件，
    如果有客户端链接上来，
    就会产生一个socket对象，
    使用这个对象，我们就可以和对应的客户端实时通信了
*/
var messages = [] // `messages数组` 暂时存储客户端上传上来的数据

io.sockets.on('connection', function (socket) {
    // socket.emit('connected')
    
    /*
        用户连上来后，
        向服务端发送getAllMessages请求，
        获取所有消息，
        服务器就把所有的消息通过allMessages事件推送给客户端；
    */
    socket.on('getAllMessages', function () {
        /* 
            服务端：发出 `allMessage` 事件，将 `messages数组` 信息发送给客户端
            客户端：接收 `allMessage` 事件，对 `messages数组` 信息遍历 `messages数组` 得到对应信息渲染模板
        */
        console.log('客户端链接上来时触发！！   ' + messages);
        socket.emit('allMessages', messages)
    })
    
    /*
        当用户创建消息时，
        向服务端发送createMessage事件，
        服务端把消息存放到messages数组中，
        并向所有的客户端广播messageAdded，有新的消息添加进来。
    */
    socket.on('createMessage', function (message) {
        messages.push(message) // 将客户端发送 `message` 信息添加到 `messages数组` 中.
        console.log('客户端发送信息时触发！！   ' + messages);
        /*
            服务端：发出 `messageAdded` 事件，传入新增的 `message` 信息。
            客户端：接受 `messageAdded` 事件，对他做什么事情呢？同样的，客户端将 `message` 信息添加到 `$scope.messages数组` 中。
        */
        io.sockets.emit('messageAdded', message)
    })
})

console.log('TechNode is on port ' + port + '!')


// // ...
// var Controllers = require('./controllers')

// app.use(express.bodyParser())
// app.use(express.cookieParser())
// app.use(express.session({
//   secret: 'technode',
//   cookie:{
//     maxAge: 60 * 1000
//   }
// }))

// ...

app.get('/api/validate', function (req, res) {
  _userId = req.session._userId
  if (_userId) {
    Controllers.User.findUserById(_userId, function (err, user) {
      if (err) {
        res.json(401, {msg: err})
      } else {
        res.json(user)
      }
    })
  } else {
    res.json(401, null)
  }
})

app.post('/api/login', function (req, res) {
  email = req.body.email
  if (email) {
    Controllers.User.findByEmailOrCreate(email, function(err, user) {
      if (err) {
        res.json(500, {msg: err})
      } else {
        req.session._userId = user._id
        res.json(user)
      }
    })
  } else {
    res.json(403)
  }
})

app.get('/api/logout', function (req, res) {
  req.session._userId = null
  res.json(401)
})

// ...
// var server = app.listen(port, function() {
//   console.log('TechNode  is on port ' + port + '!')
// })

// var io = require('socket.io').listen(server)

// io.set('authorization', function(handshakeData, accept) {
//   handshakeData.cookie = Cookie.parse(handshakeData.headers.cookie)
//   var connectSid = handshakeData.cookie['connect.sid']
//   connectSid = parseSignedCookie(connectSid, 'technode')

//   if (connectSid) {
//     sessionStore.get(connectSid, function(error, session) {
//       if (error) {
//         accept(error.message, false)
//       } else {
//         // handshakeData.session = session
//         if (session._userId) {
//           accept(null, true)
//         } else {
//           accept('No login')
//         }
//       }
//     })
//   } else {
//     accept('No session')
//   }
// })
// ...
// var parseSignedCookie = require('connect').utils.parseSignedCookie
// var MongoStore = require('connect-mongo')(express)
// var Cookie = require('cookie')

// var sessionStore = new MongoStore({
//   url: 'mongodb://localhost/technode'
// })

// app.use(express.bodyParser())
// app.use(express.cookieParser())
// app.use(express.session({
//   secret: 'technode',
//   cookie: {
//     maxAge: 60 * 1000 * 60
//   },
//   store: sessionStore
// }))