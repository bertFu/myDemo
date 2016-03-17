angular.module('techNodeApp', [])

angular.module('techNodeApp').factory('socket', function($rootScope) {
  var socket = io.connect('/')
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments
        $rootScope.$apply(function() {
          callback.apply(socket, args)
        })
      })
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args)
          }
        })
      })
    }
  }
})

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

angular.module('techNodeApp').controller('MessageCreatorCtrl', function($scope, socket) {
  $scope.newMessage = ''
  $scope.createMessage = function () {
    if ($scope.newMessage == '') {
      return
    }
    
    /*
        接受用户输入的信息，发送给服务端
    */
    socket.emit('createMessage', $scope.newMessage)
    $scope.newMessage = ''
  }
})

/* 
    监听模型信息变化，将滚动条移动至最底部，以便能查询到最新显示的信息 
*/
angular.module('techNodeApp').directive('autoScrollToBottom', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(
        function() {
          return element.children().length;
        },
        function() {
          element.animate({
            scrollTop: element.prop('scrollHeight')
          }, 1000);
        }
      );
    }
  };
});

/*
     在textarea回车，默认会换行，使用这个组件，可以通过ctrl+enter来换行，而enter则触发绑定的行为，在这里就是createMessage这个方法
*/
angular.module('techNodeApp').directive('ctrlEnterBreakLine', function() {
  return function(scope, element, attrs) {
    var ctrlDown = false
    element.bind("keydown", function(evt) {
      if (evt.which === 17) {
        ctrlDown = true
        setTimeout(function() {
          ctrlDown = false
        }, 1000)
      }
      if (evt.which === 13) {
        if (ctrlDown) {
          element.val(element.val() + '\n')
        } else {
          scope.$apply(function() {
            scope.$eval(attrs.ctrlEnterBreakLine);
          });
          evt.preventDefault()
        }
      }
    });
  };
});