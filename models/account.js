var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    name : String ,
    family : String ,
    email : { type: [String], index: true }  ,
    password :  String

});
Account.set('autoIndex', false);
Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
