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
                res.status(200).json(user)
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
                        res.status(200).json(user)
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
    // socket.emit('connected')
    
    /* 监听客户端接入 */
    socket.on('getAllMessages', function () {
        /* 向客户端发送聊天数据 */
        socket.emit('allMessages', messages)
    })
    
    /* 当用户创建消息时，向服务端发送createMessage事件，服务端把消息存放到messages数组中，并向所有的客户端广播messageAdded，有新的消息添加进来。 */
    socket.on('messagesCreate', function (message) {
        // messages.push(message) // 服务器记录信息
        
        // /* 将新的信息发送给接受用户 */
        // io.sockets.emit('messageAdded', message)
        
        // 服务端，需要将消息通过房间的形式，将消息广播开来：
        Controllers.Message.create(message, function(err, message) {
        if (err) {
            socket.emit('err', {
                msg: err
            })
        } else {
            socket.in(message._roomId).broadcast.emit('messageAdded', message)
            socket.emit('messageAdded', message)
        }
    })
    })
    
    /* 提供房间的信息 */
    socket.on('getRoom', function() {
        Controllers.User.getOnlineUsers(function (err, users) {
            if (err) {
                socket.emit('err', {msg: err})
            } else {
                socket.emit('roomData', {users: users, messages: messages})
            }
        })
    })
    /* socket.handshake.session 仍然是未定义的，是什么原因呢？ */
    var _userId = socket.handshake.session && socket.handshake.session._userId
    Controllers.User.online(_userId, function(err, user) {
        if (err) {
            socket.emit('err', {
            mesg: err
        })
        } else {
            socket.broadcast.emit('online', user)
        }
    })
    /* 断开连接，将user状态设置为离线，将离线的用户信息发送给客户端 */
    socket.on('disconnect', function() {
        // var _userId = socket.request.session._userId
        // Controllers.User.offline(_userId, function(err, user) {
        //     if (err) {
        //         socket.emit('err', {mesg: err})
        //     } else {
        //         socket.broadcast.emit('offline', user)
        //     }
        // })
        
        // 用户断网了，或者是刷新网页， 关闭网页，即socket断开了；
        Controllers.User.offline(_userId, function(err, user) {
            if (err) {
                socket.emit('err', {
                    mesg: err
                })
            } else {
                // 用户断开后，如果他正在某个房间中，通知在该房间的客户端，该用户已经离开了。
                // console.log('user');
                // console.log(user);
                if (user && user._roomId) {
                        socket.in(user._roomId).broadcast.emit('leaveRoom', user)
                        socket.in(user._roomId).broadcast.emit('messageAdded', {
                        content: user.name + '离开了聊天室',
                        creator: SYSTEM,
                        createAt: new Date(),
                        _id: ObjectId()
                    })
                    Controllers.User.leaveRoom({user: user}, function() {})
                }
            }
        })
    });
    // 服务端处理用户离开
    socket.on('leaveRoom', function(leave) {
        Controllers.User.leaveRoom(leave, function(err) {
            if (err) {
                socket.emit('err', {
                    msg: err
                })
            } else {
            socket.in(leave.room._id).broadcast.emit('messageAdded', {
                content: leave.user.name + '离开了聊天室',
                creator: SYSTEM,
                createAt: new Date(),
                _id: ObjectId()
            })
            socket.leave(leave.room._id)
            io.sockets.emit('leaveRoom', leave)
            }
        })
    })
    // 新建房间
    socket.on('createRoom', function (room) {
        Controllers.Room.create(room, function (err, room) {
            if (err) {
                socket.emit('err', {msg: err})
            } else {
                io.sockets.emit('roomAdded', room)
            }
        })
    })

    // sockets.on('getAllRooms', function () {
    //     Controllers.Room.read(function (err, rooms) {
    //         if (err) {
    //             socket.emit('err', {msg: err})
    //         } else {
    //             socket.emit('roomsData', rooms)
    //         }
    //     })
    // })
    
    // 修改getAllRooms的socket响应，如果客户端的请求数据中包含_roomId的话，就读取单独房间的数据，而不是读取所有的房间。
    socket.on('getAllRooms', function(data) {
        if (data && data._roomId) {
            Controllers.Room.getById(data._roomId, function(err, room) {
                if (err) {
                        socket.emit('err', {
                        msg: err
                    })
                } else {
                    socket.emit('roomData.' + data._roomId, room)
                }
            })
        } else {
            Controllers.Room.read(function(err, rooms) {
                if (err) {
                        socket.emit('err', {
                        msg: err
                    })
                } else {
                    socket.emit('roomsData', rooms)
                }
            })
        }
    })
    
    // socket.on('joinRoom', function(join) {
    //     Controllers.User.joinRoom(join, function(err) {
    //         if (err) {
    //             socket.emit('err', {
    //                 msg: err
    //             })
    //         } else {
    //             socket.join(join.room._id)
    //             // 通知客户端，这次加入房间成功了，可以跳转至房间了；
    //             socket.emit('joinRoom.' + join.user._id, join)
    //             // 因为之前加入了一个socket的房间，即对这个房间的其他socket广播，发了一条消息，有一个新的用户进入了聊天室，在其他客户端的聊天室页面，即可以看到这条系统通知
    //             socket.in(join.room._id).broadcast.emit('messageAdded', {
    //                 content: join.user.name + '进入了聊天室',
    //                 creator: SYSTEM,
    //                 createAt: new Date(),
    //                 _id: ObjectId()
    //             })
    //             // 这条消息则是通知客户端的有新的用户加入了房间，客户端的房间列表页和房间页则监听这个事件更新对应的用户列表。
    //             socket.in(join.room._id).broadcast.emit('joinRoom', join)
    //         }
    //     })
    // })
})


