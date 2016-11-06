angular.module('starter.controllers')
.controller('StreetLightsCtrl', function($scope, auth, store, $state, $timeout, 
HudService,$stateParams, $cordovaToast,$firebaseArray,CtrlService,$cordovaSocialSharing,localStorage,$ionicModal
,$ionicScrollDelegate,FIREBASE_URL,$cordovaCamera,$cordovaGeolocation,$cordovaLaunchNavigator,$window,$rootScope,NgMap,$filter) {

	$scope.currentCoords;
	$scope.map;
	var all = [];
	$scope.showPlusButton = true;
	var streetLightMarkers,vegetationMarkers;
	


	function init() {
		var lat,lon,requirement;
		$scope.vegetationSelected = false;
		
		// Call Service to get Current Co-ords
		$scope.currentCoords  = CtrlService.getCoords();
		console.log('Currnet coords:' , $scope.currentCoords.lat + ', ' + $scope.currentCoords.lon);

		lat = $scope.currentCoords.lat;
		lon = $scope.currentCoords.lon;

	

		var baseRef = new Firebase(FIREBASE_URL + '/streetlights');
	  var scrollRef = new Firebase.util.Scroll(baseRef, 'agcid');
		streetLightMarkers = $firebaseArray(scrollRef);
		$scope.mapMarkers = streetLightMarkers;
		scrollRef.scroll.next(100);
		


		var vegRef = new Firebase(FIREBASE_URL + '/vegetation');
	  var scrollRef1 = new Firebase.util.Scroll(vegRef, 'agcid');
		vegetationMarkers = $firebaseArray(scrollRef1);
		scrollRef1.scroll.next(100);

		$scope.ligthstyle = {background:'#33cd5f',color:'white'};
		mapInit();

	};
	init();
	

	function mapInit() {
				
		// Initialise Map
		 NgMap.getMap().then(function(map) {
			    console.log(map.getCenter());
			    $scope.map = map;
					$scope.mapIcon= 'img/medical.png';
			    console.log('markers', map.markers);
			    
			  });
	}
	
	$scope.streetlightsSelected = function(){
			$scope.mapMarkers = streetLightMarkers;
			$scope.mapIcon= 'img/medical.png';
			// $scope.showStreetLightMarkers = true;
			$scope.vegetationSelected = false;
			$scope.ligthstyle = {background:'#33cd5f',color:'white'};
		$scope.vegstyle = {background:''};
	}


	$scope.vegetationSelected = function(){
		$scope.mapMarkers = vegetationMarkers;
		$scope.mapIcon= 'img/shelters.png';
		// $scope.showStreetLightMarkers = false;

		$scope.vegetationSelected = true;

		$scope.ligthstyle = {background:''};
		$scope.vegstyle = {background:'#33cd5f','color':'white'};
	}



	$scope.showDetail = function(e, agent) {
		console.log('Show Detail111 called!', agent);
		
		$scope.agent1 = agent;
			$scope.map.showInfoWindow('foo-iw', agent.agcid);  // if issues with anchoring info-window to the marker , see https://github.com/allenhwkim/angularjs-google-maps/issues/505
					console.log('vegetation window');
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
				$scope.streetlights.$add(obj); 
			},400);
				
		 }
	//// Report New Street Light ///
		
	$scope.getPic = function(report) {
		console.log('Getting Pic for :', report);
		var picUrl = CtrlService.getPicUrlFromCameraPic(report);
		console.log('Returning Pictuer URL :' ,picUrl);
		return picUrl;;
	}
	
});