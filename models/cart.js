module.exports = function Cart(initialCart) {
	this.items = initialCart.items || {};
	this.totalQuantity = initialCart.totalQuantity || 0;
	this.totalPrice = initialCart.totalPrice || 0;

	this.add = function(item, id) {
		var storedItem = this.items[id];
		// if you don't already have an item
		if(!storedItem) {
			storedItem = this.items[id] = {item: item, quantity: 0, price: 0};
		}
		// increase quantity of item added to cart
		storedItem.quantity++;
		// calculate price as item price multiplied by quantity of item
		storedItem.price = storedItem.item.price * storedItem.quantity;
		// calculate total price and quantity of items in cart
		this.totalQuantity++;
		this.totalPrice += storedItem.item.price;
	}

	this.reduceByOne = function(id) {
		// decrease quantity of items by one
		this.items[id].quantity--;
		// decrease price by price of one item
		this.items[id].price -= this.items[id].item.price;
		// decrease quantity by one
		this.totalQuantity--;
		// decrease total price by cost of item
		this.totalPrice -= this.items[id].item.price;

		// if all of an item are removed from the cart
		if (this.items[id].quantity < 1) {
			delete this.items[id];
		}
	}

	this.removeItem = function(id) {
		// decrease total quantity by amount of items removed
		this.totalQuantity -= this.items[id].quantity;
		// decrease total price by amount of items removed
		this.totalPrice -= this.items[id].price;

		// remove item from cart
		delete this.items[id];
	}

	this.generateArray = function() {
		var array = [];
		for (var id in this.items) {
			array.push(this.items[id]);
		}
		return array;
	}
}