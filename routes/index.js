var User = require("../Schema/user");

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
		successRedirect : '/settings',
		failureRedirect : '/login',
		failureFlash : true
	}));

	app.get('/signup', function(req, res) {
		res.render('signup.ejs', {
			message: req.flash('signupMessage')
		});
	});

	app.post('/signup', passport.authenticate('local-signup', {

		successRedirect : '/settings',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	app.get('/settings', isLoggedIn, function(req, res) {
		User.findById(req.user._id, function(err, user) {
			if (err)
			return next(err);
			return res.render('settings.ejs', {
				user: user
			});
		})
	});

	app.post('/settings', isLoggedIn, function(req, res) {
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
				res.redirect('/settings');
			});
		});
	});
};
	    

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}
