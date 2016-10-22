angular.module('starter.controllers')
.controller('NeedyJobsCtrl', function($scope, auth, store, $state, JobService,$stateParams,$timeout, PersonService, $cordovaToast,$firebaseArray,CtrlService,$cordovaSocialSharing,localStorage,$ionicModal,$ionicScrollDelegate,FIREBASE_URL,$cordovaCamera,$cordovaGeolocation,$cordovaLaunchNavigator,$window,$rootScope,NgMap) {
	
	 var needyId = $stateParams.needyId;
	 console.log('Needy id', needyId);
	 $scope.currentCoords  = CtrlService.getCoords();
	 
	 function init() {
		 var baseRef = new Firebase(FIREBASE_URL + '/needy/' + needyId);
		 
		 baseRef.on("value", function(snapshot) {
			 var needyPerson = snapshot.val();
			 $scope.needyName = needyPerson.name;
			 var skills = needyPerson.skills;
			 var skillsArray = skills.split(",");
			 console.log(skillsArray);
	
			 /// TODO: Find jobs for all skills not just first.
			 var resp = JobService.GetJobsForSkills(skillsArray[0]);
			 resp.then(function(data) {
							 var x2js = new X2JS();
	             var jsonResp  = x2js.xml_str2json(data.data);
	             $scope.jobs = jsonResp.response.results.result;
							 console.log('Response from webservice', jsonResp.response.results.result);
			 });
			  
			}, function (errorObject) {
			  console.log("The read failed: " + errorObject.code);
			});
		 
		// Initialise Map
		 NgMap.getMap().then(function(map) {
			    console.log(map.getCenter());
			    $scope.map = map;
			    console.log('markers', map.markers);
			    
			  });
	 }  
	 	init();
	 
	 	
	 
	 	$scope.showDetail = function(e, job) {
			 if (this.getAnimation() != null) {
        this.setAnimation(null);
      } else {
        this.setAnimation(google.maps.Animation.BOUNCE);
      }
			$scope.job1 = job;
		    $scope.map.showInfoWindow('foo-iw', job.jobkey);  // if issues with anchoring info-window to the marker , see https://github.com/allenhwkim/angularjs-google-maps/issues/505
		  };
		
		  
		$scope.openSite = function(link) {
			window.open(link, '_system', 'location=yes'); 
			return false;
		}
		
		// Calculate distance of each agency from current location
		$scope.getDistance = function(job) {
			return CtrlService.getDistanceFromLatLonInMiles($scope.currentCoords.lat,$scope.currentCoords.lon,job.latitude,job.longitude);
		}


		$scope.launchNav = function(job) {
			CtrlService.launchNavigation(job.latitude,job.longitude);
		}
		
		 $scope.doRefresh = function() {
			 init();
			 $scope.$broadcast('scroll.refreshComplete');
		  }
});