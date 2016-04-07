angular.module('techNodeApp').controller('MessageCreatorCtrl', function($scope, socket) {

    // $scope.createMessage = function () {
    //     if(!$scope.newMessage) return false;
    //     /* 发送用户新信息 */
    //     socket.emit('messagesCreate', {
    //         message: $scope.newMessage,
    //         creator: $scope.me
    //     })
    //     $scope.newMessage = ''
    // }
    
    // 现在聊天室创建的消息，必须是针对特定房间的，这些消息仅在特定的房间内传递。
    $scope.createMessage = function () {
        // socket.emit('messages.create', {
        socket.emit('messagesCreate', {
            content: $scope.newMessage,
            creator: $scope.me,
            _roomId: $scope.room._id // 传递给服务端一个参数，_roomId。
        })
        $scope.newMessage = ''
    }
})