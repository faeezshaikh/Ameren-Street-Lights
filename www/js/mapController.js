angular.module('starter.controllers')
.controller('MapCtrl', function($scope, auth, store, $state, $timeout, 
HudService,$stateParams, $cordovaToast,$firebaseArray,CtrlService,$cordovaSocialSharing,localStorage,$ionicModal
,$ionicScrollDelegate,FIREBASE_URL,$cordovaCamera,$cordovaGeolocation,$cordovaLaunchNavigator,$window,$rootScope,NgMap,$filter,PersonService) {

	$scope.currentCoords;
	$scope.map;
	var all = [];
	$scope.showPlusButton = true;
	
	
	// var $scope.mapMarkers,vegetationMarkers;
	


	function init() {
		var lat,lon,requirement;
		$scope.vegetationSelected = false;
		
		// Call Service to get Current Co-ords
		$scope.currentCoords  = CtrlService.getCoords();
		console.log('Currnet coords:' , $scope.currentCoords.lat + ', ' + $scope.currentCoords.lon);

		lat = $scope.currentCoords.lat;
		lon = $scope.currentCoords.lon;

	$scope.data = {
				demographic:'Lights'
			};

		var baseRef = new Firebase(FIREBASE_URL + '/streetlights');
	  var scrollRef = new Firebase.util.Scroll(baseRef, 'agcid');
		$scope.mapMarkers = $firebaseArray(scrollRef);
		all = $scope.mapMarkers;
		scrollRef.scroll.next(100);
		


		// var vegRef = new Firebase(FIREBASE_URL + '/vegetation');
	  // var scrollRef1 = new Firebase.util.Scroll(vegRef, 'agcid');
		// $scope.vegetationMarkers = $firebaseArray(scrollRef1);
		// scrollRef1.scroll.next(100);

		// $scope.ligthstyle = {background:'#33cd5f',color:'white'};
		mapInit();

	};
	init();
	

	function mapInit() {
				
		// Initialise Map
		 NgMap.getMap().then(function(map) {
			    console.log(map.getCenter());
			    $scope.map = map;
					$scope.mapIcon= 'img/light2.png';
			    // console.log('markers', map.markers);
			    
			  });
	}
	
	// $scope.streetlightsSelected = function(){
	// 		$scope.mapIcon= 'img/light2.png';
	// 		$scope.vegetationSelected = false;
	// 		$scope.ligthstyle = {background:'#33cd5f',color:'white'};
	// 	$scope.vegstyle = {background:''};
	// }


	// $scope.vegetationSelected = function(){
	// 	$scope.mapIcon= 'img/veg2.png';
	// 	$scope.vegetationSelected = true;
	// 	$scope.ligthstyle = {background:''};
	// 	$scope.vegstyle = {background:'#33cd5f','color':'white'};
	// }



	$scope.$watch('data.demographic',function(){
		
		console.log('Printing..',$scope.mapMarkers);
		// if($scope.data.demographic == 'Lights') { console.log('Changed !',$scope.data.demographic);$scope.mapMarkers = $filter('filter')(all, { type: 'Lit' }); }
		// if($scope.data.demographic == 'Vegetation')  { console.log('Changed !',$scope.data.demographic);  $scope.mapMarkers = $filter('filter')(all, { type: 'Veg' }); }
    });

	$scope.showDetail = function(e, agent) {
		console.log('Show Detail111 called!', agent);
		
		$scope.agent1 = agent;
			$scope.map.showInfoWindow('foo-iw', $scope.agent1.agcid);  // if issues with anchoring info-window to the marker , see https://github.com/allenhwkim/angularjs-google-maps/issues/505
					console.log('light window');
	  };
	

		// $scope.showDetailVegetation = function(e, agent) {
		// console.log('Show Detail-veg called!', agent);
		
		// $scope.agent1_veg = agent;
		// 	$scope.map.showInfoWindow('foo-iw-veg', $scope.agent1_veg.agcid);  // if issues with anchoring info-window to the marker , see https://github.com/allenhwkim/angularjs-google-maps/issues/505
		// 			console.log('vegetation window');
	  // };
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
					// dob: new Date('Dec 1, 2016'),
					dob: new Date(),
					phone: '314-876-3452',
					email: 'johnny@gmail.com',
					address: '1901 Chouteau Ave. St Louis MO 63101',
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
				"agc_ADDR_LONGITUDE": $scope.currentCoords.lon,
				"agc_ADDR_LATITUDE": $scope.currentCoords.lat,
				"reporter": $scope.newShelter.name,
				"dateReported": $scope.newShelter.dob.toString(),
				"reporterPhone":$scope.newShelter.phone,
				"reporterEmail":$scope.newShelter.email,
				"address":$scope.newShelter.address,
				"desc":$scope.newShelter.desc,
				"cameraPic":$scope.imageData || null,
				"reporterPic" : PersonService.GetUserDetails().img
			};


							$timeout(function(){
										$scope.mapMarkers.$add(obj); 
									},500);  
								
			
		
				
		 }


	

	 		/////// PICTURE /////////
		$scope.useLocation = true;
	 
	  $scope.removePicture = function() {
		  $scope.imageData = false;
	  }
	  $scope.addPicture = function(upload) {
		  console.log('adding picture');
		  document.addEventListener("deviceready", function () {
			  var options = {
				      quality: 90,
				      destinationType: Camera.DestinationType.DATA_URL,
				      // sourceType: Camera.PictureSourceType.CAMERA, // CAMERA or PHOTOLIBRARY
				      allowEdit: true,
				      encodingType: Camera.EncodingType.JPEG,
				      targetWidth: 200,
				      targetHeight: 200,
				      popoverOptions: CameraPopoverOptions,
				      saveToPhotoAlbum: false,
				      correctOrientation:true
				    };

						if(upload) {
							options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
						} else {
							options.sourceType = Camera.PictureSourceType.CAMERA;
						}


				    $cordovaCamera.getPicture(options).then(function(imageData) {
							$scope.imageData = imageData;
				    
				    	console.log('Pic Taken',$scope.imageData);
//				      var image = document.getElementById('myImage');
//				      image.src = "data:image/jpeg;base64," + imageData;
				    }, function(err) {
				      // error
								console.log('Error in taking picture');
								
				    });

				
		  },false);
		 
	};
	
			///////// PICTURE /////////

	//// Report New Street Light ///
		
	$scope.getPic = function(report) {
		var picUrl = CtrlService.getPicUrlFromCameraPic(report);
		return picUrl;;
	}
	
});