angular.module('techNodeApp').controller('MessageCreatorCtrl', function($scope, socket) {

    $scope.createMessage = function () {
        if(!$scope.newMessage) return false;
        /* 发送用户新信息 */
        socket.emit('messagesCreate', {
            message: $scope.newMessage,
            creator: $scope.me
        })
        $scope.newMessage = ''
    }
})