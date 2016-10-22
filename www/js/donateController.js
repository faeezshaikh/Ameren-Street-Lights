angular.module('starter.controllers')
.controller('DonateCtrl', function($scope, auth, $http,$stateParams,
			store, $state, $timeout, PersonService, $cordovaToast,$firebaseArray,CtrlService,$cordovaSocialSharing,localStorage,$ionicModal,$ionicScrollDelegate,FIREBASE_URL,$cordovaCamera) {


	 var needyId = $stateParams.needyId;
	 console.log('Needy id', needyId);
	 var prepopulate = false;

	// Ionic Stripe Integration with Noodlio Pay
		// https://market.ionic.io/starters/stripe-charge-with-checkout-nodejs-server

		// Check balance:
		// https://dashboard.stripe.com/test/dashboard

	  $scope.auth = auth;
	
	// These are fixed values, do not change this
	  var NOODLIO_PAY_API_URL         = "https://noodlio-pay.p.mashape.com"; 
	  var NOODLIO_PAY_API_KEY         = "Vx5Ihif4zMmshYtChutzHN3L5cCXp15E49ejsnEIKzZsOVoEGM";

	  // Obtain your unique Stripe Account Id from here:
	  // https://www.noodl.io/pay/connect
		var STRIPE_ACCOUNT_ID           = "acct_17FG06APEFpkLkhT"; // Obtained on Sep 17,2016.

	  // Define whether you are in development mode (TEST_MODE: true) or production mode (TEST_MODE: false)
	  var TEST_MODE = true;
	  
	  // add the following headers for authentication
	  $http.defaults.headers.common['X-Mashape-Key']  = NOODLIO_PAY_API_KEY;
	  $http.defaults.headers.common['Content-Type']   = 'application/x-www-form-urlencoded';
	  $http.defaults.headers.common['Accept']         = 'application/json';

		$scope.FormData = {
				'number': '',
				'cvc': '',
				'exp_month': '',
				'exp_year': '',
				'test': TEST_MODE, 
				'amount': 1,
				'rememberme': false
			};
	  
	 function getPersonDetails() {
		 var baseRef = new Firebase(FIREBASE_URL + '/needy/' + needyId);
		 
		 baseRef.on("value", function(snapshot) {
			 $scope.needyPerson = snapshot.val();
			 console.log('Donating needy person',$scope.needyPerson);
			}, function (errorObject) {
			  console.log("The read failed: " + errorObject.code);
			});

	 }  
	 if(needyId){
	 	getPersonDetails();
	 }

		$scope.getPic = function(person) {
			console.log('Getting Pic for', person);
			return CtrlService.getPicUrlFromCameraPic(person);
		}

		$scope.isFormValid = function() {
				if($scope.FormData.number && $scope.FormData.cvc && $scope.FormData.exp_month && $scope.FormData.exp_year) {
						return false;
				}
				return true;
		}

	  // charge the customer with the token
	  function proceedCharge(token,amount) {
	    
	    var param = {
	      source: token,
	      amount: amount,
	      currency: "usd",
	      description: "Your custom description here",
	      stripe_account: STRIPE_ACCOUNT_ID,
	      test: TEST_MODE,
	    };
	    
	    $http.post(NOODLIO_PAY_API_URL + "/charge/token", param)
	    .success(
	      function(response){
	        
	        // --> success
	        console.log(response);
	        $scope.ResponseData['loading'] = false;
					$scope.paid = true;
					if(needyId){
								/// Update the person's balance in Firebase ////
								$scope.needyPerson.balance += (amount/100);
								var fredNameRef = new Firebase('https://homelesscare.firebaseio.com/needy/' + needyId);
								fredNameRef.update({ balance: $scope.needyPerson.balance });
								//// Update ends ///////
					}
	        
	        if(response.hasOwnProperty('id')) {
	          var paymentId = response.id; $scope.ResponseData['paymentId'] = paymentId;
	        } else {
	          $scope.ResponseData['paymentId'] = 'Error, try again.';
						$scope.ResponseData.error = true;
	        };
	        
	      }
	    )
	    .error(
	      function(response){
	        console.log(response)
	        $scope.ResponseData['paymentId'] = 'Error, try again.';
	        $scope.ResponseData['loading'] = false;
					$scope.ResponseData.error = true;
	      }
	    );
	  };
	  
 
	  
	  
	  
	  
	//// Scan Card /////////

	// Simply install the plugin and attach this function to the ng-click of a button ..that's it.
	// https://github.com/card-io/card.io-Cordova-Plugin
	// sudo cordova plugin add https://github.com/card-io/card.io-Cordova-Plugin
	
	


	$scope.scanCard = function () {
		console.log('Scan Card called');
		
		var cardIOResponseFields = [
			"cardType",
			"redactedCardNumber",
			"cardNumber",
			"expiryMonth",
			"expiryYear",
			"cvv",
			"postalCode"
		];

		var onCardIOComplete = function (response) {
			console.log("card.io scan complete");
			var str = "";
			var obj = {};
			for (var i = 0, len = cardIOResponseFields.length; i < len; i++) {
				var field = cardIOResponseFields[i];
				str += field + ": " + response[field] + ". ";
				obj[field] = response[field];
				console.log(field + ": " + response[field]);
			}
			console.log('IO Complete ****', str);
			cardCaptured(obj);
		};



		var onCardIOCancel = function () {
			console.log("card.io scan cancelled");
		};



		CardIO.scan({
			"requireExpiry": true,
			"requireCVV": true,
			"requirePostalCode": false,
			"restrictPostalCodeToNumericOnly": true,
			"scanExpiry": true
		},
			onCardIOComplete,
			onCardIOCancel
		);

	}
	 	
	function cardCaptured(obj) {
		// alert(obj);
			$scope.FormData = {
				    'number': obj.cardNumber,
				    'cvc': parseInt(obj.cvv),
				    'exp_month': obj.expiryMonth,
				    'exp_year': obj.expiryYear,
				    'test': TEST_MODE, 
						'amount': 1,
						'rememberme': false
				  };

					$scope.$apply();

	}

	//// Scan Card /////////


	$scope.submitDonation = function() {

		//for demo purposes, pre-prepopulate the FormData	

     var creditCardObj = {};
			var testCreditCard = {
				'number': 4242424242424242,
				'cvc': 123,
				'exp_month': 01,
				'exp_year': 2020,
				'test': TEST_MODE
			};
			testCreditCard.amount = $scope.FormData.amount;
		  
		  // console.log('Printing FormData: ', $scope.FormData);
		    $scope.paid = false;
		  // init for the DOM
		    $scope.ResponseData = {
		      loading: true
		    };

				if(prepopulate) {
					creditCardObj = testCreditCard;
				} else {
					creditCardObj = $scope.FormData
				}
		    
		    // create a token and validate the credit card details
				// $http.post(NOODLIO_PAY_API_URL + "/tokens/create", $scope.FormData)
		    $http.post(NOODLIO_PAY_API_URL + "/tokens/create", creditCardObj)
		    .success(
		      function(response){
		        
		        // --> success
		        console.log(response)
		        
		        if(response.hasOwnProperty('id')) {
		          var token = response.id; $scope.ResponseData['token'] = token;
							var dollars = parseInt($scope.FormData.amount) * 100;
		          proceedCharge(token,dollars);  // pass amount and description
		        } else {
		          $scope.ResponseData['token'] = 'Error, try again.' + response.message;
		          $scope.ResponseData['loading'] = false;
							$scope.ResponseData.error = true;
		        };

		      }
		    )
		    .error(
		      function(response){
		        console.log(response)
		        $scope.ResponseData['token'] = 'Error, try again.';
		        $scope.ResponseData['loading'] = false;
						$scope.ResponseData.error = true;
		      }
		    ); 
	}

	$scope.onRangeChange = function() {
		$scope.paid = false;
	}

	$scope.prepopulateForm = function() {
			// $scope.FormData.number = ;
			prepopulate = true;
			$scope.FormData = {
				'number': '************4242',
				'cvc': 123,
				'exp_month': 01,
				'exp_year': 2020,
				'test': TEST_MODE, 
				'amount': 1,
				'rememberme': true
			};
			console.log('form',	$scope.FormData);
	}
});