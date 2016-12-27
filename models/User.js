var mongoose = require('mongoose');

var BookmarkSchema = new mongoose.Schema({
	name:String,
	url:String,
	category:String
});


var UserSchema = new mongoose.Schema({
	username:String,
	password:String,
	permission:Number,
	firstName:String,
	lastName:String,
	bookmarks: [BookmarkSchema]
});


mongoose.model('user', UserSchema);
