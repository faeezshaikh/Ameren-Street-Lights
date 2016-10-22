angular.module('starter.controllers')

.controller('SocialShareCtrl', function($scope,$cordovaSocialSharing) {
	
 var message = "Check out the new Friend In Need App in the app store.";
 var image = "https://s3-us-west-2.amazonaws.com/amerenppl/icon.png";
 var link = "https://play.google.com/store/apps/details?id=com.ionicframework.awsArch";
 var subject = "The Friend In Need App";
 var smsMessage = message + ": " + link;
 
	$scope.shareFb = function() {
		console.log('Facebook sharing');
		  $cordovaSocialSharing
		    .shareViaFacebook(message, image, link)
		    .then(function(result) {
		      // Success!
//		    	 console.log('sharing successfull');
		    }, function(err) {
		      // An error occurred. Show a message to the user
		    	console.log('sharing failed');
		    	 alert('No facebook app installed on your device');
		    });
	  
	}
	$scope.shareTwitter = function() {
		$cordovaSocialSharing
	    .shareViaTwitter(message, image, link)
	    .then(function(result) {
	      // Success!
//	    	console.log('sharing successfull');
	    }, function(err) {
	    	console.log('sharing failed:No Twitter app installed on your device');
	    	 alert('No Twitter app installed on your device');
	    });

	}
	$scope.shareWhatsapp = function() {
		$cordovaSocialSharing
	    .shareViaWhatsApp(message, image, link)
	    .then(function(result) {
	      // Success!
	    }, function(err) {
	      // An error occurred. Show a message to the user
	    	console.log('sharing failed:No Whatspp app installed on your device');
	    	 alert('No Whatspp app installed on your device');
	    });
	}
	$scope.shareSms = function() {
		$cordovaSocialSharing
	    .shareViaSMS(smsMessage, '')
	    .then(function(result) {
	      // Success!
	    }, function(err) {
	    	console.log('sharing failed- SMS');
	    	 alert('Uh oh! There was some problem!');
	    });
	}
	$scope.shareEmail = function() {
		$cordovaSocialSharing
	    .shareViaEmail(smsMessage, subject, [], [], [], image)
	    .then(function(result) {
	      // Success!
	    }, function(err) {
	    	console.log('sharing failed - Email');
	    	 alert('Uh oh! There was some problem!');
	    });
	}
	
	
});

