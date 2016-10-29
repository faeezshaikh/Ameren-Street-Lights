angular.module('starter.controllers')
.controller('StreetLightsCtrl', function($scope, auth, store, $state, $timeout, 
HudService,$stateParams, $cordovaToast,$firebaseArray,CtrlService,$cordovaSocialSharing,localStorage,$ionicModal
,$ionicScrollDelegate,FIREBASE_URL,$cordovaCamera,$cordovaGeolocation,$cordovaLaunchNavigator,$window,$rootScope,NgMap,$filter) {

	$scope.currentCoords;
	$scope.map;
	var all = [];
	$scope.showPlusButton = true;
	
	function init() {
		var needyId = $stateParams.needyId; // Not using it..really.
		var lat,lon,requirement;
		
		// Call Service to get Current Co-ords
		$scope.currentCoords  = CtrlService.getCoords();
		console.log('Currnet coords:' , $scope.currentCoords.lat + ', ' + $scope.currentCoords.lon);


		if(needyId) {
			var baseRef = new Firebase(FIREBASE_URL + '/needy/' + needyId);
			$scope.showPlusButton = false;
			
			baseRef.on("value", function(snapshot) {
				var needyPerson = snapshot.val();
				lat = needyPerson.lat;
				lon = needyPerson.long;
				requirement = 'Male'; // TODO: Fetch from Firebase

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

			if(requirement == 'Male')  $scope.data.demographic = 'Male';

		 var baseRef = new Firebase(FIREBASE_URL + '/streetlights');

	  var scrollRef = new Firebase.util.Scroll(baseRef, 'agcid');
	  $scope.openbeds = $firebaseArray(scrollRef);
		all = $scope.openbeds;
			  scrollRef.scroll.next(100);
		console.log('StreetLightsCtrl:', $scope.openbeds);



		// Closed beds

		// 		 var baseRef2 = new Firebase(FIREBASE_URL + '/closedbeds');

	  // var scrollRef2 = new Firebase.util.Scroll(baseRef2, 'agcid');
	  // $scope.closedbeds = $firebaseArray(scrollRef2);
		// 	  scrollRef2.scroll.next(100);
		// console.log('closedbeds beds:', $scope.closedbeds);

		// Closed beds


		
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
		if($scope.data.demographic == 'Veteran')  $scope.openbeds = $filter('filter')(all, { requirement: 'Veteran' });
		if($scope.data.demographic == 'Family')  $scope.openbeds = all;
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
	 
	

	//// Report New Street Light ///


	 $ionicModal.fromTemplateUrl('templates/reportStreetLight.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.composeIdeaModal = modal;
		});

		$scope.openComposer = function() {
		  // $scope.newPerson = {};
			// $scope.removePicture();
		 	$scope.composeIdeaModal.show();
	  }
  
	  $scope.closeComposer = function() {
		  $scope.composeIdeaModal.hide();
		  // $scope.editIdeaModal.hide();
	  }


	$scope.autoFill = function () {
				$scope.newShelter = {
					name: 'Johnny Cash',
					dob: new Date('Dec 1, 2016'),
					phone: '314-876-3452',
					email: 'johnny@gmail.com',
					address: '30 Plaza Sq. St Louis MO 63010',
					desc:'Light keeps flickering. Has been doing that for several days now.'
				};
			}


 		$scope.finalSubmit = function() {
		  // $scope.confirmationModal.hide();
		  $scope.composeIdeaModal.hide();
			var obj = 
			{
"agcid": "82040",
"nme": "YOUTH EDUCATION AND HEALTH IN SOULARD",
"zipcd": "63104-3915",
"agc_ADDR_LONGITUDE": "-90.20798",
"agc_ADDR_LATITUDE": "38.602318",
"reporter": $scope.newShelter.name,
"dateReported": $scope.newShelter.dob.toString(),
"reporterPhone":$scope.newShelter.phone,
"reporterEmail":$scope.newShelter.email,
"address":$scope.newShelter.address,
"desc":$scope.newShelter.desc,

}
			
			// $scope.openbeds.push();
			$timeout(function(){
				$scope.openbeds.$add(obj); 
			},700);
				
		 }
	//// Report New Street Light ///
		
		
	
});