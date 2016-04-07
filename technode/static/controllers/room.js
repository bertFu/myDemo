angular.module('techNodeApp').controller('RoomCtrl', function($scope, $routeParams, socket) {
    // 首先修改RoomCtrl，通过$routeParams获取route参数，触发getRoom事件，到服务器端读取房间数据；
    socket.emit('getAllRooms', {
        _roomId: $routeParams._roomId
    })
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
    // 这里加上roomid是什么意思
    socket.on('roomData.' + $routeParams._roomId, function (room) {
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
    // 其次是接受新的消息，并当用户加入到房间时，将用户加入到用户列表中。
    // socket.on('joinRoom', function (join) {
    //     $scope.room.users.push(join.user)
    // })
    
    // 用户到了其他的页面
    $scope.$on('$routeChangeStart', function() {
        socket.emit('leaveRoom', {
            user: $scope.me,
            room: $scope.room
        })
    })
    socket.on('leaveRoom', function(leave) {
        _userId = leave.user._id
        $scope.room.users = $scope.room.users.filter(function(user) {
            return user._id != _userId
        })
    })
})