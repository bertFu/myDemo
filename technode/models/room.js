var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 房间名称房间的创建时间
var Room = new Schema({
  name: String,
  createAt:{type: Date, default: Date.now}
});

module.exports = Room