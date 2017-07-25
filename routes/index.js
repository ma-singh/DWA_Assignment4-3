var express = require('express');
var router = express.Router();
var stripe = require("stripe")("sk_test_O9vl5hRHcCsM8lPBJbuaRxbW");

var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

var cartStatus = false;

/* GET home page. */
router.get('/', function(req, res, next) {
	var successMsg = req.flash('success')[0];

	if (req.session.cart) {
		if (req.session.cart.totalQuantity >= 1) {
			cartStatus = true;
		}
		if (req.session.cart.totalQuantity < 1) {
			cartStatus = false;
		}
	}

	Product.find(function(err, docs) {
  		res.render('shop/index', { title: 'interNASHional', products: docs, cartStatus: cartStatus, successMsg: successMsg, noMessage: !successMsg });
	});
});

router.get('/add-to-cart/:id', function(req, res, next) {
	// get id of product being added to cart
	var productId = req.params.id;
	// create a new cart when an item is added to the cart
	// pass the old cart if one exists, otherwise just send an empty javascript object
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId, function(err, product) {
		if (err) {
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		res.redirect('/');
	});
});

router.get('/reduce/:id', function(req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.reduceByOne(productId);
	req.session.cart = cart;
	res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.removeItem(productId);
	req.session.cart = cart;
	res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next) {
	if (req.session.cart) {
		if (req.session.cart.totalQuantity >= 1) {
			cartStatus = true;
		}
		if (req.session.cart.totalQuantity < 1) {
			cartStatus = false;
		}
	}
	if (!req.session.cart) {
		return res.render('shop/shopping-cart', { products: null });
	}
	var cart = new Cart(req.session.cart);
	return res.render('shop/shopping-cart', { cartStatus: cartStatus, products: cart.generateArray(), totalPrice: cart.totalPrice });
});

router.get('/checkout', function(req, res, next) {
	if (req.session.cart) {
		if (req.session.cart.totalQuantity >= 1) {
			cartStatus = true;
		}
		if (req.session.cart.totalQuantity < 1) {
			cartStatus = false;
		}
	}
	if (!req.session.cart) {
		return res.redirect('shop/shopping-cart');
	}
	var cart = new Cart(req.session.cart);
	var errMsg = req.flash('error')[0];
	return res.render('shop/checkout', { cartStatus: cartStatus, totalPrice: cart.totalPrice, errMsg: errMsg, noErrors: !errMsg });
});

router.post('/checkout', function(req, res, next) {
	if (!req.session.cart) {
		return res.redirect('shop/shopping-cart');
	}
	var token = req.body.stripeToken;
	var cart = new Cart(req.session.cart);

	var payment = stripe.charges.create({
		amount: Math.round(cart.totalPrice * 100),
		currency: "usd",
		description: "Stripe Payment",
		source: token,
	}, function(err, payment) {
		if (err) {
			req.flash('error', err.message);
			return res.redirect('/checkout');
		}
		// if the user is a guest, simply purchase the products, empty the cart and redirect to the homepage
		if (!req.isAuthenticated()) {
			req.flash('success', 'Successfully purchased products!');
			req.session.cart = null;
			return res.redirect('/');
		}
		// if the user is logged in, save the order to the database
		if (req.isAuthenticated()) {
			var order = new Order({
				cart: cart,
				user: req.user,
				address: req.body.address,
				name: req.body.name,
				paymentId: payment.id
			});
			order.save(function(err, result) {
				req.flash('success', 'Successfully purchased products!');
				req.session.cart = null;
				return res.redirect('/');
			});
		}
	});
});

module.exports = router;
