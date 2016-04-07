var db = require('../models')
var async = require('async')
// 创建新的房间。
exports.create = function(room, callback) {
  var r = new db.Room()
  r.name = room.name
  r.save(callback)
}
// 查找所有的房间，包括当前在这个房间的用户列表，我们使用房间ID到用户列表中查询属于当前房间的用户；
exports.read = function(callback) {
  db.Room.find({}, function(err, rooms) {
    if (!err) {
      var roomsData = []
      async.each(rooms, function(room, done) {
        var roomData = room.toObject()
        db.User.find({
          _roomId: roomData._id,
          online: true
        }, function(err, users) {
          if (err) {
            done(err)
          } else {
            roomData.users = users
            roomsData.push(roomData)
            done()
          }
        })
      }, function(err) {
        callback(err, roomsData)
      })
    }
  })
}

// 使用async并行地把room中的用户和消息都读取出来。注意，只读取最新的20条消息，且按照时间的排序，最新的在最后。
exports.getById = function(_roomId, callback) {
    db.Room.findOne({
        _id: _roomId
    }, function(err, room) {
        if (err) {
            callback(err)
        } else {
            async.parallel([

                function(done) {
                    db.User.find({
                        _roomId: _roomId,
                        online: true
                    }, function(err, users) {
                        done(err, users)
                    })
                },
                function(done) {
                    db.Message.find({
                        _roomId: _roomId
                    }, null, {
                    sort: {
                            'createAt': -1
                        },
                        limit: 20
                    }, function(err, messages) {
                        done(err, messages.reverse())
                    })
                }
                ],
                function(err, results) {
                    if (err) {
                        callback(err)
                    } else {
                        room = room.toObject()
                        room.users = results[0]
                        room.messages = results[1]
                        callback(null, room)
                    }
                });
        }
    })
}