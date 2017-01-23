'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var MerchantConfig = require('./../merchant.config');

function deleteCustomerProfile(customerProfileId, callback) {

    var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(MerchantConfig.AUTHNET_API_LOGIN_ID);
    merchantAuthenticationType.setTransactionKey(MerchantConfig.AUTHNET_TRANSACTION_KEY);

	var deleteRequest = new ApiContracts.DeleteCustomerProfileRequest();
	deleteRequest.setMerchantAuthentication(merchantAuthenticationType);
	deleteRequest.setCustomerProfileId(customerProfileId);

	//pretty print request
	//console.log(JSON.stringify(createRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.DeleteCustomerProfileController(deleteRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.DeleteCustomerProfileResponse(apiResponse);

		//pretty print response
		//console.log(JSON.stringify(response, null, 2));

		if(response != null) 
		{
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK)
			{
				console.log('Successfully deleted a customer profile with id: ' + customerProfileId);
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
	deleteCustomerProfile('41004277', function(){
		console.log('deleteCustomerProfile call complete.');
	});
}

module.exports.deleteCustomerProfile = deleteCustomerProfile;