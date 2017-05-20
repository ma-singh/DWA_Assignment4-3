var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

// store user in session
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

// retrieve user from session by id
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use('local.signup', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done) {
	// validate user input
	req.checkBody('email', 'Invalid email').notEmpty().isEmail();
	req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
	var errors = req.validationErrors();
	if(errors) {
		var messages = [];
		errors.forEach(function(error) {
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}


	User.findOne({'email' : email}, function(err, user) {
		// if there was an error
		if(err) {
			return done(err);
		}
		// if there's no error, but wasn't successful
		if (user) {
			return done(null, false, {message: 'Email is already in use.'});
		}
		// create a new user
		var newUser = new User();
		newUser.email = email;
		// set new user's password using user model's encryption method
		newUser.password = newUser.encryptPassword(password);
		// save user
		newUser.save(function(err, result) {
			// if there was an error
			if (err) {
				return done(err);
			}
			return done(null, newUser);
		});
	});
}));

passport.use('local.signin', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done) {
	// validate user input
	req.checkBody('email', 'Invalid email').notEmpty().isEmail();
	req.checkBody('password', 'Invalid password').notEmpty();
	var errors = req.validationErrors();
	if(errors) {
		var messages = [];
		errors.forEach(function(error) {
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}

	User.findOne({'email' : email}, function(err, user) {
		// if there was an error
		if(err) {
			return done(err);
		}
		// if the email doesn't match
		if (!user) {
			return done(null, false, {message: 'User not found.'});
		}
		// if the password doesn't match
		if (!user.validPassword(password)) {
			return done(null, false, {message: 'The password was entered incorrectly.'});
		}
		return done(null, user);
	});
}));
