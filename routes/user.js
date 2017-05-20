var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var methodOverride = require('method-override');

var Order = require('../models/order');
var Cart = require('../models/cart');
var Product = require('../models/product');

var csrfProtection = csrf();
router.use(csrfProtection);

var cartStatus = false;

router.use(methodOverride(function(req, res, next) {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		var method = req.body._method;
		delete req.body._method;
		return method;
	}
}));

// admin page
router.get('/admin', isAdmin, function(req, res, next) {
	console.log('hello admin');

	Product.find(function(err, docs) {
		return res.render('user/admin', { csrfToken: req.csrfToken(), products: docs });
	});
});

router.post('/admin', function(req, res, next) {
	var product = new Product({
		title: req.body.title,
		description: req.body.description,
		price: req.body.price,
		imagePath: req.body.imagePath
	});
	product.save(function(err, result) {
		return res.redirect('/');
	});
});

router.get('/admin/edit/:id', function(req, res, next) {
	var productId = req.params.id;

	Product.findById(productId, function(err, result) {
		if (err) {
			return console.error(err);
		}
		return res.render('user/update', { csrfToken: req.csrfToken(), product: result});
	});
});

router.put('/admin/edit/:id', function(req, res, next) {
	var productId = req.params.id;

	var title = req.body.title,
		description = req.body.description,
		price = req.body.price,
		imagePath = req.body.imagePath;

	Product.findById(productId, function(err, result) {
		if (err) {
			return console.error(err);
		}
		result.title = title;
		result.description = description;
		result.price = price;
		result.imagePath = imagePath;
		result.save(function(err, result) {
			res.redirect('/user/admin');
		});
	});
});

router.delete('/admin/remove/:id', function(req, res, next) {
	var productId = req.params.id;
	
	Product.findById(productId, function(err, result) {
		if (err) {
			return console.error(err);
		}
		result.remove(function(err, result) {
			res.redirect('/user/admin');
		});
	});
});

// redirect to user profile
router.get('/profile', isLoggedIn, function(req, res, next) {

	if (req.session.cart) {
		if (req.session.cart.totalQuantity >= 1) {
			cartStatus = true;
		}
		if (req.session.cart.totalQuantity < 1) {
			cartStatus = false;
		}
	}

	if (req.user.email == "test@test.com") {
		var isAdmin = true;
	}

	Order.find({user: req.user}, function(err, orders) {
		if (err) {
			return res.write('Error!');
		}
		var cart;
		orders.forEach(function(order) {
			cart = new Cart(order.cart);
			order.items = cart.generateArray();
		});
		return res.render('user/profile', { cartStatus: cartStatus, user: req.user.email, isAdmin: isAdmin, orders: orders });
	});
});

router.get('/logout', function(req, res, next) {
	req.session.destroy(function(err) {
		res.redirect('/');
	});
});

router.use('/', notLoggedIn, function(req, res, next) {
	next();
});

// route to register a user
router.get('/signup', function(req, res, next) {
	var messages = req.flash('error');

	if (req.session.cart) {
		if (req.session.cart.totalQuantity >= 1) {
			cartStatus = true;
		}
		if (req.session.cart.totalQuantity < 1) {
			cartStatus = false;
		}
	}

	res.render('user/signup', {csrfToken: req.csrfToken(), cartStatus: cartStatus, messages: messages, hasErrors: messages.length > 0});
});
// form submission for ser registration
router.post('/signup', passport.authenticate('local.signup', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signup',
	failureFlash: true
}));

// route to sign in
router.get('/signin', function(req, res, next) {
	var messages = req.flash('error');

	if (req.session.cart) {
		if (req.session.cart.totalQuantity >= 1) {
			cartStatus = true;
		}
		if (req.session.cart.totalQuantity < 1) {
			cartStatus = false;
		}
	}

	res.render('user/signin', {csrfToken: req.csrfToken(), cartStatus: cartStatus, messages: messages, hasErrors: messages.length > 0});
});
// form submission for login
router.post('/signin', passport.authenticate('local.signin', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signin',
	failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

function notLoggedIn(req, res, next) {
	if(!req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

function isAdmin(req, res, next) {
	if(req.isAuthenticated()) {
		if(req.user.email == "test@test.com") {
			return next();
		}
		res.redirect('/');
	}
}