var mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/technode')
exports.User = mongoose.model('User', require('./user'))
exports.Message = mongoose.model('Message', require('./message'))