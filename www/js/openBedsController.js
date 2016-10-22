angular.module('starter.controllers')
.controller('OpenBedsCtrl', function($scope, auth, store, $state, $timeout, 
HudService,$stateParams, $cordovaToast,$firebaseArray,CtrlService,$cordovaSocialSharing,localStorage,$ionicModal
,$ionicScrollDelegate,FIREBASE_URL,$cordovaCamera,$cordovaGeolocation,$cordovaLaunchNavigator,$window,$rootScope,NgMap,$filter) {

	$scope.currentCoords;
	$scope.map;
	var all = [];
	
	function init() {
		var needyId = $stateParams.needyId; // Not using it..really.
		var lat,lon;
		
		// Call Service to get Current Co-ords
		$scope.currentCoords  = CtrlService.getCoords();
		console.log('Currnet coords:' , $scope.currentCoords.lat + ', ' + $scope.currentCoords.lon);


		if(needyId) {
			var baseRef = new Firebase(FIREBASE_URL + '/needy/' + needyId);
			
			baseRef.on("value", function(snapshot) {
				var needyPerson = snapshot.val();
				lat = needyPerson.lat;
				lon = needyPerson.long;
				}, function (errorObject) {
					console.log("The read failed: " + errorObject.code);
				});
		} else {
					lat = $scope.currentCoords.lat;
					lon = $scope.currentCoords.lon;
		}

				// Call Service to get data
		// HudService.GetHudAgents(lat,lon,15).then(function(response) {
		// 	$scope.hudagents = response.data;
		// });

  $scope.data = {
    demographic:'Family',
  };

		 var baseRef = new Firebase(FIREBASE_URL + '/openbeds');

	  var scrollRef = new Firebase.util.Scroll(baseRef, 'agcid');
	  $scope.openbeds = $firebaseArray(scrollRef);
		all = $scope.openbeds;
			  scrollRef.scroll.next(100);
		console.log('Open beds:', $scope.openbeds);
		
		// Initialise Map
		 NgMap.getMap().then(function(map) {
			    console.log(map.getCenter());
			    $scope.map = map;
			    console.log('markers', map.markers);
			    
			  });
	};
	init();
	
	

	$scope.$watch('data.demographic',function(){
		console.log('Changed !',$scope.data.demographic);
		if($scope.data.demographic == 'Male')  $scope.openbeds = $filter('filter')(all, { requirement: 'Male' });
		if($scope.data.demographic == 'Female')  $scope.openbeds = $filter('filter')(all, { requirement: 'Female' });
		if($scope.data.demographic == 'Vets')  $scope.openbeds = $filter('filter')(all, { requirement: 'Veteran' });
		if($scope.data.demographic == 'Family')  $scope.openbeds = $filter('filter')(all, { requirement: 'Family' });
    });
	$scope.showDetail = function(e, agent) {
		$scope.agent1 = agent;
	    $scope.map.showInfoWindow('foo-iw', agent.agcid);  // if issues with anchoring info-window to the marker , see https://github.com/allenhwkim/angularjs-google-maps/issues/505
	  };
	
	// Calculate distance of each agency from current location
	$scope.getDistance = function(agent) {
		return CtrlService.getDistanceFromLatLonInMiles($scope.currentCoords.lat,$scope.currentCoords.lon,agent.agc_ADDR_LATITUDE,agent.agc_ADDR_LONGITUDE);
	}
	
	$scope.openSite = function(link) {
		window.open(link, '_system', 'location=yes'); 
		return false;
	}
	
	$scope.launchNav = function(agent) {
		CtrlService.launchNavigation(agent.agc_ADDR_LATITUDE,agent.agc_ADDR_LONGITUDE);
	}
	
	 $scope.doRefresh = function() {
		 init();
		 $scope.$broadcast('scroll.refreshComplete');
	  }
	 
	

	
		
		
	
});