angular.module('techNodeApp').controller('RoomsCtrl', function($scope, socket) {
    socket.emit('getAllRooms')
    socket.on('roomsData', function (rooms) {
        console.log('roomsData');
        console.log(rooms);
        $scope.rooms = $scope._rooms = rooms
    })
    // 是过滤rooms的实现，我们仅仅做了简单的字符串包含的匹配；这也正式我们把原始数据保存在_rooms中的原因。
    $scope.searchRoom = function () {
        if ($scope.searchKey && $scope._rooms) {
            console.log('searchRoom');
            $scope.rooms = $scope._rooms.filter(function (room) {
                return room.name.indexOf($scope.searchKey) > -1
            })
        } else {
            $scope.rooms = $scope._rooms
        }

    }
    // 通过调用服务端的接口创建房间，房间创建完成，服务端会触发一个roomAdded的事件，我们将新的房间加入到_rooms中，调用$scope.searchRoom()手动进行一次搜索，将新增的房间同步到rooms中。
    $scope.createRoom = function () {
        socket.emit('createRoom', {
            name: $scope.searchKey
        })
    }
    socket.on('roomAdded', function (room) {
        $scope._rooms.push(room)
        $scope.searchRoom()
    })

    // 是与rooms.html中的房间绑定的
    // 当服务端处理完用户进入房间的动作之后，会向客户端发送一个joinRoom.52b380a837a4f24736000001的事件，即对应之前客户端发送的那个加入房间的请求。客户端收到这个事件之后，就跳转到特定的聊天室去了。
    $scope.enterRoom = function (room) {
        console.log('renterRoom')
        socket.emit('joinRoom', {
            user: $scope.me,
            room: room
        })
    }
    // 即当有用户加入到某个房间后，服务端都广播这个事件，便于客户端更新在房间里的用户。
    // socket.once('joinRoom.' + $scope.me._id, function (join) {
    //     $location.path('/rooms/' + join.room._id)
    // })
    socket.on('joinRoom.' + $scope.me._id, function (join) {
        console.log('joinRoom.' + $scope.me._id); // todo
        $location.path('/rooms/' + join.room._id)
    })
    socket.on('joinRoom', function (join) {
        $scope.rooms.forEach(function (room) {
            if (room._id == join.room._id) {
                room.users.push(join.user)
            }
        })
    })
})