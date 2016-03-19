var express = require('express')
var async = require('async')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var app = express()
var path = require('path')
var port = process.env.PORT || 3000; //接收命令行启动参数用作服务器启动端口，没有参数则选择3000端口作为默认端口
var Controllers = require('./controllers')
var signedCookieParser = cookieParser('technode')
var MongoStore = require('connect-mongo')(session)

var sessionStore = new MongoStore({
    url: 'mongodb://localhost/technode'
})

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
    store: sessionStore
}))

/* express.static 设置node的静态文件夹，将所有的静态文件放在该文件夹下 */
app.use(express.static(__dirname + '/static'))

/* 判断`session`中的`_userId`，如果有返回Id，没有的话返回错误信息。 */
app.get('/api/validate', function (req, res) {
    _userId = req.session._userId
    if (_userId) {
        Controllers.User.findUserById(_userId, function (err, user) {
            if (err) {
                res.status(401).json({msg: err})
            } else {
                res.status(401).json({msg: err})
            }
        })
    } else {
        res.status(401).json({})
    }
})

/* 用户登入，如果该用户存在数据库中直接返回，否则包装`user对象`插入新数据，返回包装后的`user对象` */
app.post('/api/login', function(req, res) {
    email = req.body.email
    if (email) {
        Controllers.User.findByEmailOrCreate(email, function(err, user) {
            if (err) {
                res.status(500).json({msg: err})
            } else {
                req.session._userId = user._id
                Controllers.User.online(user._id, function (err, user) {
                    if (err) {
                        res.status(500).json({msg: err})
                    } else {
                        res.status(200).json({})
                    }
                })
            }
        })
    } else {
        res.status(403).json({})
    }
})

/* 提供给客户端退出时调用，设置用户为离线状态，成功设置后删除`session`中的`userId` */
app.get('/api/logout', function(req, res) {
    _userId = req.session._userId
    Controllers.User.offline(_userId, function (err, user) {
        if (err) {
            res.status(500).json({msg: err})
        } else {
            res.status(200).json({})
            delete req.session._userId
        }
    })
})

/* 将static文件夹下的index.html作为整个应用的启动页面；除静态文件请求外，其他所有的HTTP请求都将输出index.html文件；服务器不关心路由，所有的路由逻辑都交给Angular.js处理 */
app.use(function (req, res) {
    // res.sendfile('./static/index.html')
    res.sendFile(path.join(__dirname, './static/index.html'))
})

/* 开启`socket`服务 */
var server = app.listen(port, function() {
    console.log('TechNode  is on port ' + port + '!')
})

var io = require('socket.io').listen(server)

/* socket三次握手，判断用户信息 */
io.set('authorization', function(handshakeData, accept) {
    /* todo 这里的cook解析有问题所以导致没办法找到session，需要升入了解 */
    signedCookieParser(handshakeData, {}, function(err) {
        if (err) {
            accept(err, false)
        } else {
            sessionStore.get(handshakeData.signedCookies['connect.sid'], function(err, session) {
                if (err) {
                    accept(err.message, false)
                } else {
                    /* 无法获取到session数据，session为undefined */
                    handshakeData.session = session
                    if (session && session._userId) {
                        accept(null, true)
                    } else {
                        accept('No login')
                    }
                }
            })
        }
    })
})

/* 服务器端监听connection事件，如果有客户端链接上来，就会产生一个socket对象，使用这个对象，我们就可以和对应的客户端实时通信了 */
var messages = [] // `messages数组` 暂时存储客户端上传上来的数据

io.sockets.on('connection', function (socket) {
    socket.emit('connected')
    
    /* 用户连上来后，向服务端发送getAllMessages请求，获取所有消息，服务器就把所有的消息通过allMessages事件推送给客户端； */
    socket.on('getAllMessages', function () {
        
        /*  服务端：发出 `allMessage` 事件，将 `messages数组` 信息发送给客户端
            客户端：接收 `allMessage` 事件，对 `messages数组` 信息遍历 `messages数组` 得到对应信息渲染模板  */
        socket.emit('allMessages', messages)
    })
    
    /* 当用户创建消息时，向服务端发送createMessage事件，服务端把消息存放到messages数组中，并向所有的客户端广播messageAdded，有新的消息添加进来。 */
    socket.on('messagesCreate', function (message) {
        messages.push(message) // 将客户端发送 `message` 信息添加到 `messages数组` 中.
        /*  服务端：发出 `messageAdded` 事件，传入新增的 `message` 信息。
            客户端：接受 `messageAdded` 事件，对他做什么事情呢？同样的，客户端将 `message` 信息添加到 `$scope.messages数组` 中。 */
        io.sockets.emit('messageAdded', message)
    })
    
    socket.on('getRoom', function() {
        Controllers.User.getOnlineUsers(function (err, users) {
            if (err) {
                socket.emit('err', {msg: err})
            } else {
                socket.emit('roomData', {users: users, messages: messages})
            }
        })
    })
    
    _userId = socket.handshake.session && socket.handshake.session._userId
    Controllers.User.online(_userId, function(err, user) {
        if (err) {
            socket.emit('err', {
            mesg: err
        })
        } else {
            socket.broadcast.emit('online', user)
        }
    })
    socket.on('disconnect', function() {
        Controllers.User.offline(_userId, function(err, user) {
        if (err) {
            socket.emit('err', {
            mesg: err
            })
        } else {
            socket.broadcast.emit('offline', user)
        }
        })
    });
})


