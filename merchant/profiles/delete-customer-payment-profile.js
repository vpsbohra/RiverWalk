'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var MerchantConfig = require('./../merchant.config');

function deleteCustomerPaymentProfile(customerProfileId, customerPaymentProfileId, callback) {

    var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(MerchantConfig.AUTHNET_API_LOGIN_ID);
    merchantAuthenticationType.setTransactionKey(MerchantConfig.AUTHNET_TRANSACTION_KEY);

	var deleteRequest = new ApiContracts.DeleteCustomerPaymentProfileRequest();
	deleteRequest.setMerchantAuthentication(merchantAuthenticationType);
	deleteRequest.setCustomerProfileId(customerProfileId);	
	deleteRequest.setCustomerPaymentProfileId(customerPaymentProfileId);

	//pretty print request
	//console.log(JSON.stringify(createRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.DeleteCustomerPaymentProfileController(deleteRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.DeleteCustomerPaymentProfileResponse(apiResponse);

		//pretty print response
		//console.log(JSON.stringify(response, null, 2));

		if(response != null) 
		{
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK)
			{
				console.log('Successfully deleted a customer payment profile with id: ' + customerPaymentProfileId);
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
	deleteCustomerPaymentProfile('41003872', '38764361', function(){
		console.log('deleteCustomerPaymentProfile call complete.');
	});
}

module.exports.deleteCustomerPaymentProfile = deleteCustomerPaymentProfile;