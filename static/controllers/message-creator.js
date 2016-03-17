angular.module('techNodeApp').controller('MessageCreatorCtrl', function($scope, socket) {
//   $scope.newMessage = ''
//   $scope.createMessage = function () {
//     if ($scope.newMessage == '') {
//       return
//     }
    
//     /*
//         接受用户输入的信息，发送给服务端
//     */
//     socket.emit('createMessage', $scope.newMessage)
//     $scope.newMessage = ''
//   }
 $scope.createMessage = function () {
    // socket.emit('messages.create', {
    socket.emit('createMessage', {
      message: $scope.newMessage,
      creator: $scope.me
    })
    $scope.newMessage = ''
  }
})