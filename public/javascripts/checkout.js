// ****************************************************** //
// this initializes Stripe Payments and Stripe Elements
// ****************************************************** //

var stripe = Stripe('pk_test_mkt7kMihjkoqVyTdcpvUk6Em');
var elements = stripe.elements();

// create stripe elements for form input of credit card information
var cardNumber = elements.create('cardNumber');
var cardExpiration = elements.create('cardExpiry');
var cardCVC = elements.create('cardCvc');
var cardZipCode = elements.create('postalCode');

// mount elements to DOM
cardNumber.mount('#card-number');	
cardExpiration.mount('#card-expiry');
cardCVC.mount('#card-cvc');
cardZipCode.mount('#postal-code');

function stripeTokenHandler(token) {
	// insert the token id into the form so it gets submitted to the server
	var form = document.getElementById('checkout-form');
	var hiddenInput = document.createElement('input');
	hiddenInput.setAttribute('type', 'hidden');
	hiddenInput.setAttribute('name', 'stripeToken');
	hiddenInput.setAttribute('value', token.id);
	form.appendChild(hiddenInput);

	// submit the form
	form.submit();
}

function createToken() {
	stripe.createToken(cardNumber).then(function(result) {
		if(result.error) {
			// inform user of error
			var errorElement = document.getElementById('#card-errors');
			errorElement.textContent = result.error.message;
			$('#card-errors').removeClass('hidden');
		} else {
			// send the token to your server
			stripeTokenHandler(result.token);
		}
	});
}

cardNumber.addEventListener('change', function(event) {
	var displayError = document.getElementById('#card-errors');
  	if (event.error) {
    	displayError.textContent = event.error.message;
    	$('#card-errors').removeClass('hidden');
    	$(this).find('button').prop('disabled', true);
  	} else {
    	displayError.textContent = '';
    	$(this).find('button').prop('disabled', false);
  	}
});

var form = document.getElementById('checkout-form');
form.addEventListener('submit', function(e) {
	e.preventDefault();
	$(this).find('button').prop('disabled', true);
	createToken();
});