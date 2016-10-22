angular.module('starter.controllers')
.controller('NeedyDetailsCtrl', function($scope, auth, store, $state, JobService,$stateParams,$timeout, PersonService, $cordovaToast,$firebaseArray,CtrlService,$cordovaSocialSharing,localStorage,$ionicModal,$ionicScrollDelegate,FIREBASE_URL,$cordovaCamera,$cordovaGeolocation,$cordovaLaunchNavigator,$window,$rootScope,NgMap) {
	
	 var needyId = $stateParams.needyId;
	 console.log('Needy id', needyId);
	 
	 function init() {
		 var baseRef = new Firebase(FIREBASE_URL + '/needy/' + needyId);
		 
		 baseRef.on("value", function(snapshot) {
			 $scope.needyPerson = snapshot.val();
			}, function (errorObject) {
			  console.log("The read failed: " + errorObject.code);
			});

	 }  
	 	init();

	$scope.getThumbnail = function(person) {
		return CtrlService.getPicUrlFromCameraPic(person);
	}

	$scope.getTelephone = function(num) {
		if(num) {
			return "tel:1-"+num;
		} else {
			return "tel:1-314-814-6195";
		}
	}

	$scope.getVideo = function(person) {
		return person.video;
	}

	 $scope.share = function(item) {
		  console.log('sharing called',item);
		  $cordovaSocialSharing
		    .share(item.story, "Friend In Need",  item.picture,"https://globalhack.org/globalhack-vi/") // Share via native share sheet
		    .then(function(result) {
		      // Success!
		    	 console.log('sharing successfull');
		    }, function(err) {
		      // An error occured. Show a message to the user
		    	 console.log('sharing failed');
		    });
	  }
	 
});