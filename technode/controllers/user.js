var db = require('../models')
var async = require('async')
var gravatar = require('gravatar')

exports.findUserById = function (_userId, callback) {
    db.User.findOne({
        _id: _userId
    }, callback)
}

exports.findByEmailOrCreate = function (email, callback) {
    db.User.findOne({
        email: email
    }, function (err, user) {
        if (user) {
            callback(null, user)
        } else {
            user = new db.User
            user.name = email.split('@')[0]
            user.email = email
            user.avatarUrl = gravatar.url(email)
            user.save(callback)
        }
    })
}

exports.online = function(_userId, callback) {
    db.User.findOneAndUpdate({
        _id: _userId
    }, {
        $set: {
            online: true
        }
    }, callback)
}

exports.offline = function(_userId, callback) {
    db.User.findOneAndUpdate({
        _id: _userId
    }, {
        $set: {
            online: false
        }
    }, callback)
}

exports.getOnlineUsers = function(callback) {
    db.User.find({
        online: true
    }, callback)
}
// 用户加入到某个房间后，服务端都广播这个事件
exports.joinRoom = function (join, callback) {
  db.User.findOneAndUpdate({
    _id: join.user._id
  }, {
    $set: {
      online: true,
      _roomId: join.room._id
    }
  }, callback)
}