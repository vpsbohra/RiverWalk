'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var MerchantConfig = require('./../merchant.config');

function getMerchantDetails(callback) {
    var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(MerchantConfig.AUTHNET_API_LOGIN_ID);
    merchantAuthenticationType.setTransactionKey(MerchantConfig.AUTHNET_TRANSACTION_KEY);

	var getRequest = new ApiContracts.GetMerchantDetailsRequest();
	getRequest.setMerchantAuthentication(merchantAuthenticationType);

	console.log(JSON.stringify(getRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.GetMerchantDetailsController(getRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.GetMerchantDetailsResponse(apiResponse);

		console.log(JSON.stringify(response, null, 2));

		if(response != null){
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
				console.log('Merchant Name : ' + response.getMerchantName());
				console.log('Gateway Id : ' + response.getGatewayId());
				console.log('Processors : ');

				var processors = response.getProcessors().getProcessor();
				for (var i=0;i<processors.length;i++)
				{
					console.log("\t" + processors[i].getName());
				}

				console.log('Message Code : ' + response.getMessages().getMessage()[0].getCode());
				console.log('Message Text : ' + response.getMessages().getMessage()[0].getText());
			}
			else{
				console.log('Result Code: ' + response.getMessages().getResultCode());
				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
			}
		}
		else{
			console.log('Null Response.');
		}
		
		callback(response);
	});
}

if (require.main === module) {
	getMerchantDetails(function(){
		console.log('getMerchantDetails call complete.');
	});
}

module.exports.getMerchantDetails = getMerchantDetails;