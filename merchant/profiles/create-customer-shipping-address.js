'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var MerchantConfig = require('./../merchant.config');

function createCustomerShippingAddress(customerProfileId, callback) {

    var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(MerchantConfig.AUTHNET_API_LOGIN_ID);
    merchantAuthenticationType.setTransactionKey(MerchantConfig.AUTHNET_TRANSACTION_KEY);

	var customerAddress = new ApiContracts.CustomerAddressType();
	customerAddress.setFirstName('test');
	customerAddress.setLastName('scenario');
	customerAddress.setAddress('123 Main Street');
	customerAddress.setCity('Bellevue');
	customerAddress.setState('WA');
	customerAddress.setZip('98002');
	customerAddress.setCountry('USA');
	customerAddress.setPhoneNumber('000-000-0000');

	var createRequest = new ApiContracts.CreateCustomerShippingAddressRequest();
	createRequest.setMerchantAuthentication(merchantAuthenticationType);
	createRequest.setCustomerProfileId(customerProfileId);
	createRequest.setAddress(customerAddress);	

	//pretty print request
	console.log(JSON.stringify(createRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.CreateCustomerShippingAddressController(createRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.CreateCustomerShippingAddressResponse(apiResponse);

		//pretty print response
		//console.log(JSON.stringify(response, null, 2));

		if(response != null) 
		{
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK)
			{
				console.log('Successfully created a customer payment profile with id: ' + response.getCustomerAddressId());
			}
			else
			{
				//console.log('Result Code: ' + response.getMessages().getResultCode());
				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
			}
		}
		else
		{
			console.log('Null response received');
		}

		callback(response);
	});
}

if (require.main === module) {
	createCustomerShippingAddress('41003872', function(){
		console.log('createCustomerShippingAddress call complete.');
	});
}

module.exports.createCustomerShippingAddress = createCustomerShippingAddress;