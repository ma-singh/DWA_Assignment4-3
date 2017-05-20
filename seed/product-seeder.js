var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('localhost:27017/shopping');

var products = [
	new Product({
		imagePath: 'images/injustice-year5-19.jpeg',
		title: 'Injustice: Year 5 (19)',
		description: 'As Superman scours the earth for Bizarro, Luthor desperately tries to figure out how to destroy the failed clone he created.',
		price: 2.99
	}),
	new Product({
		imagePath: 'images/injustice-groundzero-9.jpeg',
		title: 'Injustice: Ground Zero (9)',
		description: 'The desperate plot to free Batman from Stryker’s Island and prevent his execution reaches its climax.',
		price: 2.99
	}),
	new Product({
		imagePath: 'images/injustice-year5-18.jpeg',
		title: 'Injustice: Year 5 (18)',
		description: 'Bizarro\'s trail of destruction sinks to new depths and the trail is pointing back to Luthor. Can Lex eliminate this rogue before Superman discovers the connection?',
		price: 2.99
	}),
	new Product({
		imagePath: 'images/deadpool_suicidekings-4.jpeg',
		title: 'Deadpool: Suicide Kings (4)',
		description: 'Deadpool\'s been framed. No, really! This time, Wade didn\'t do it! To prove his innocence and find the person responsible, he\'s got to avoid the Punisher (wants to kill him) and Spider-Man (wants to web him). Luckily for Wade, a certain Man Without Fear believes his story...',
		price: 3.99
	}),
	new Product({
		imagePath: 'images/deadpool-9702-6.jpeg',
		title: 'Deadpool: \'97 (5)',
		description: 'Deadpool sets out to kill...Dr. Killebrew? Plus, things heat up with Siryn!',
		price: 3.99
	}),
	new Product({
		imagePath: 'images/batman-europa-3.jpeg',
		title: 'Batman: Europa (3)',
		description: 'Weakened by a deadly virus, Batman arrives in Paris to find some answers.',
		price: 4.99
	})
];

var done = 0;
for (var i = 0; i < products.length; i++)
{
	products[i].save(function(err, result) {
		done++;
		if (done === products.length) {
			exit();
		}
	});
}

function exit() {
	mongoose.disconnect();
}