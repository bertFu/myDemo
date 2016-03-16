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
var messages = []

io.sockets.on('connection', function (socket) {
    // socket.emit('connected')
    socket.on('getAllMessages', function () {
        socket.emit('allMessages', messages)
    })
    socket.on('createMessage', function (message) {
        messages.push(message)
        io.sockets.emit('messageAdded', message)
    })
})

console.log('TechNode is on port ' + port + '!')