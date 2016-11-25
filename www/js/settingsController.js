angular.module('starter.controllers')

.controller('SettingsCtrl', function($scope,PersonService,$state,$window,CtrlService,localStorage,FIREBASE_URL){
	$scope.checkboxes = [
	                  { text: "Alert on new incident", checked: true },
	                  { text: "Show Vegetation Incident", checked: false },
	                  { text: "Alert all nearby truck drivers", checked: true },
	                  // { text: "Alert if incident is fixed", checked: true }
	                ];
	
	 $scope.logout = function() {
		  PersonService.SetLoginState(false);
		  var chatRef = new Firebase(FIREBASE_URL);
	    chatRef.unauth();
//	    $scope.msg = "Signing out of chat..";
//	    $scope.loggedIn = false;
//	    $scope.loginProgress = true;
	    $state.go('app.map'); // adding this for device.. location.href doesnt work on device
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