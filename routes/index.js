var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('user');

// GET Users List
router.get('/user/list', function(req, res, next) {
  User.find(function(err, user){
    if(err){ return next(err); }
    console.log(user);
    res.status(200).send(user);
  });
});

// POST Users Registration
router.post('/user/register', function(req, res){
	let username = req.body.username;
	let password = req.body.password;
	let permission = req.body.permission;
	let firstName = req.body.firstName;
	let lastName = req.body.lastName;

	let newUser =  new User();
	newUser.username = username;
	newUser.password = password;
	newUser.permission = permission;
	newUser.firstName = firstName;
	newUser.lastName = lastName;

	newUser.save(function(err, saveUser){
		if(err){
			console.log(err);
			return res.status(500).send();
		}

		return res.status(200).send();
	})
});

//TODO gotta find a better way to list this
router.get('/bookmarks', function(req,res){
	let username = req.query.username;

	User.find({username : username}, function(err, doc){
		if(err) return res.status(500).send();
		return res.status(200).send(doc);
	});
});

// POST Bookmarks Add
router.post('/bookmark/add', function(req,res){
	let name = req.body.name;
	let url = req.body.url;
	let category = req.body.category;
	let id = req.body.id;
	let username = req.body.username;
	query = {'username' : username};
	let bookmark = {id, category, name, url};

	User.findOneAndUpdate(query, {$push: {bookmarks:bookmark}}, function(err, doc){
		if(err) return res.status(500).send();
		return res.status(200).send();
	});
});

// POST Bookmarks Removal
router.post('/bookmark/remove', function(req, res){
	let id = req.body._id;
	let username = req.body.username;
	query = {'username' : username};

	User.findOneAndUpdate(query, {$pull: {bookmarks:{_id:id}}}, function(err, doc){
		if(err){ 
			console.log(err);
			return res.status(500).send();
		}
		return res.status(200).send();
	});
});

// PUT Bookmarks Edit
router.put('/bookmark/edit', function(req, res){
	let id = req.query.id;
	let category = req.body.category;
	let name = req.body.name;
	let url = req.body.url;
	query = {'bookmarks._id' : id};
	console.log ('test ',query);
	User.findOneAndUpdate(query, {$set: {'bookmarks.$.name':name, 'bookmarks.$.url':url, 'bookmarks.$.category':category}},{ "upsert": true }, function(err, doc){
		if(err){ 
			console.log(err);
			return res.status(500).send();
		}
		console.log(doc);
		return res.status(200).send();
	});
});

// POST Auth
router.post('/user/login', function(req, res){
	let username = req.body.username;
	let password = req.body.password;

	User.findOne({username: username, password: password}, function(err, user){
		if(err) return res.status(500).send();

		if(!user){
			return res.status(401).send();
		}
		return res.status(200).send(user);
	})
});

module.exports = router;