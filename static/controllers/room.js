angular.module('techNodeApp').controller('RoomCtrl', function($scope, socket) {
  $scope.messages = []
  socket.emit('getAllMessages') // 告诉服务端，我要和你链接了。
  
  /*
    获取服务端当前的聊天信息 `messages`
  */
  socket.on('allMessages', function (messages) {
    $scope.messages = messages
  })
  
  /*
    获取服务端返回的最新信息添加到 `messages` 数组中
  */
  socket.on('messageAdded', function (message) {
    $scope.messages.push(message)
  })
})