angular.module('starter.controllers')

.controller('SettingsCtrl', function($scope,PersonService,$state,$window,CtrlService,localStorage,FIREBASE_URL){
	$scope.checkboxes = [
	                  { text: "Show New Events", checked: true },
	                  { text: "Alert if new members in the area", checked: true },
	                  { text: "Dont show who have exceeded stay", checked: false },
	                  { text: "Alert if new volunteers sign up", checked: true }
	                ];
	
	 $scope.logout = function() {
		  PersonService.SetLoginState(false);
		  var chatRef = new Firebase(FIREBASE_URL);
	    chatRef.unauth();
//	    $scope.msg = "Signing out of chat..";
//	    $scope.loggedIn = false;
//	    $scope.loginProgress = true;
	    $state.go('app.needy'); // adding this for device.. location.href doesnt work on device
	    $window.location.reload();

	  }
	  $scope.user= {
		        min:0,
		        max:10,
		        value:JSON.parse(localStorage.get("hotnessNumber"))
		    }
	  
	  $scope.onRangeChange = function() {
		  JSON.stringify(localStorage.set("hotnessNumber", $scope.user.value));
	  }
	
});