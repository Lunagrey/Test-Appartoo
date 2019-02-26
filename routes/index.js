var User = require("../Schema/user");
var Events = require("../Schema/event");

module.exports = function(app, passport) {
	app.get('/', (req, res) => {
		res.render('./index');
	});
	
	app.get('/login', function(req, res) {
		res.render('login.ejs', {
			message: req.flash('loginMessage')
		}); 
	});
	
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profil',
		failureRedirect : '/login',
		failureFlash : true
	}));
	
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', {
			message: req.flash('signupMessage')
		});
	});
	
	app.post('/signup', passport.authenticate('local-signup', {	
		successRedirect : '/login',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	app.get('/events', isLoggedIn, function(req, res) {
		Events.find(function (err, events) {
			if (err) return console.error(err);
			res.render('events.ejs', {
				events: events
			});
		})
	});

	app.get('/addevent', isLoggedIn, function(req, res) {
		Events.find(function (err, events) {
			if (err) return console.error(err);
			res.render('addevent.ejs', {
				events: events
			});
		})
	});

	app.post('/addevent', isLoggedIn, function(req, res) {
		console.log(req.body)
		var newEvent = new Events();
		newEvent.lieu = req.body.lieu;
		newEvent.date = req.body.date;
		newEvent.heure = req.body.heure;
		newEvent.save(function(err) {
			if (err) throw err;
			else res.render('addevents.ejs');
		});
	});

	app.get('/friends', isLoggedIn, function(req, res) {
		User.find(function (err, users) {
			if (err) throw err;
			res.render('friends.ejs', {
				users: users,
				user: req.user
			});
		})
	});
	
	app.post('/friends',  isLoggedIn, function(req, res) {
		User.findById(req.user._id, function (err, newUser) {
			if (err) return console.log(err);
			if (typeof req.body.friend === 'string')
				newUser.local.friends.push(req.body.friend)
			else {
				for (var i = 0; i < req.body.friend; i++) {
					newUser.local.friends.push(req.body.friend[i])
				}
			}
			newUser.save(function (err, updatednewUser) {
				if (err) throw err;
				res.redirect('/profil');
			});
		});
	});

	app.get('/profil', isLoggedIn, function(req, res) {
		User.findById(req.user._id, function(err, user) {
			if (err)
			return next(err);
			return res.render('profil.ejs', {
				user: user
			});
		})
	});

	app.post('/profil', isLoggedIn, function(req, res) {
		User.findById(req.session.passport.user, function (err, newUser) {
		if (err) return handleError(err);
		if (req.body.age)
			newUser.local.age = req.body.age;
		if (req.body.famille)
			newUser.local.famille = req.body.famille;
		if (req.body.role)
			newUser.local.role = req.body.role;
		if (req.body.nourriture)
			newUser.local.nourriture = req.body.nourriture;
		newUser.save(function (err, updatednewUser) {
				if (err) return handleError(err);
				res.redirect('/profil');
			});
		});
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};
	    

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}
