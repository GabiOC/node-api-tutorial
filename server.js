
// BASE SETUP
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/node-bears');
var Bear = require('./models/bear');
var Kitty = require('./models/kitty');

// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
var router = express.Router(); // get an instance of the express Router
router.use(function(req, res, next){
	console.log('Something is happening.');
	next(); // make sure we go to the next route and don't stop here
});

// test route to make sure everything is working
router.get('/', function(req, res){
	res.json({message: 'hooray! welcome to our api!'});
});

router.route('/bears')
	// create a bear
	.post(function(req,res){

		var bear = new Bear(); // create a new instance of bear model
		bear.name = req.body.name; // set the bear's name from request

		// save the bear and check for errors
		bear.save(function(err){
			if(err)
				res.send(err);
			res.json({ message: 'Bear created!'});
		});
	})

	.get(function(req, res){
		Bear.find(function(err, bears){
			if(err)
				res.send(err);
			res.json(bears);
		});
	});

router.route('/bears/:bear_id')
// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
	.get(function(req, res){
		Bear.findById(req.params.bear_id, function(err, bear){
			if(err)
				res.send(err);
			res.json(bear);
		});
	})

	// update the bear with this id
	.put(function(req, res){
		// use our bear model to find the bear we want
		Bear.findById(req.params.bear_id, function(err, bear){
			if(err)
				res.send(err);
			bear.name = req.body.name; // update the bear's info

			//save the bear
			bear.save(function(err){
				if(err)
					res.send(err);
				res.json({ message: 'Bear updated!'});
			});
		});
	})

	// delete the bear with this id
	.delete(function(req, res){
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear){
			if (err)
				res.send(err);
			res.json({ message: 'Bear deleted!'});
		});
	});

router.route('/kitties')
	// create a kitty
	.post(function(req,res){

		var kitty = new Kitty();
		kitty.name = req.body.name;
		kitty.url = req.body.url;

		kitty.save(function(err){
			if(err)
				res.send(err);
			res.json({ message: 'Kitty created!'});
		});
	})

	.get(function(req, res){
		Kitty.find(function(err, kitties){
			if(err)
				res.send(err);
			res.json(kitties);
		});
	});

router.route('/kitties/:kitty_id')
	.get(function(req, res){
		Kitty.findById(req.params.kitty_id, function(err, kitty){
			if(err)
				res.send(err);
			res.json(kitty);
		});
	})

	// update the kitty with this id
	.put(function(req, res){
		Kitty.findById(req.params.kitty_id, function(err, kitty){
			if(err)
				res.send(err);
			kitty.name = req.body.name; // update the kitty's info
			kitty.url = req.body.url;

			kitty.save(function(err){
				if(err)
					res.send(err);
				res.json({ message: 'Kitty updated!'});
			});
		});
	})

	.delete(function(req, res){
		Kitty.remove({
			_id: req.params.kitty_id
		}, function(err, kitty){
			if (err)
				res.send(err);
			res.json({ message: 'Kitty deleted!'});
		});
	});


// REGISTER OUR ROUTES
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);
