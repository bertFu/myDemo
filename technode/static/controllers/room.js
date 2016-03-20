angular.module('techNodeApp').controller('RoomCtrl', function($scope, socket) {
    // $scope.messages = []
    socket.emit('getAllMessages') // 告诉服务端，我要和你链接了。
    
    /* 获取服务端当前的聊天信息 `messages` */
    socket.on('allMessages', function (messages) {
        // $scope.messages = messages
    })
    
    /* 获取服务端返回的最新信息添加到 `messages` 数组中 */
    socket.on('messageAdded', function (message) {
        $scope.room.messages.push(message)
    })
    /* 得到房间数据 */
    socket.on('roomData', function (room) {
        $scope.room = room
    })
    /* 发送获取房间数据请求 */
    socket.emit('getRoom')
    /* 接收上线用户 */
    socket.on('online', function (user) {
        $scope.room.users.push(user)
    })
    /* 接受用户离线 */
    socket.on('offline', function (user) {
        _userId = user._id
        $scope.room.users = $scope.room.users.filter(function (user) {
            return user._id != _userId
        })
    })

})