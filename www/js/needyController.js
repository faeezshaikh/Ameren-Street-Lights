angular.module('starter.controllers')
.controller('NeedyCtrl', function($scope, auth, store, $state, $timeout, PersonService, $cordovaToast,$firebaseArray,CtrlService,$cordovaSocialSharing,localStorage,$ionicModal,$ionicScrollDelegate,FIREBASE_URL,$cordovaCamera,$cordovaGeolocation,$cordovaLaunchNavigator,$window,$rootScope) {
	  
	  $scope.auth = auth;
	  $scope.items = [];
	  var ideaToDelete = {};
		$scope.newPerson = {useLocation:true};
	  
		CtrlService.saveCurrentCoords();
	  
	  var baseRef = new Firebase(FIREBASE_URL + '/needy');

	  var scrollRef = new Firebase.util.Scroll(baseRef, 'order');
	  $scope.items = $firebaseArray(scrollRef);
	  CtrlService.setFeeds($scope.items);
	  scrollRef.scroll.next(3);
	 
	  
	  ////
	  var lastPersonRef = new Firebase(FIREBASE_URL + '/lastPerson');
//	  var feedQuery = lastIdeaRef.orderByChild("id").equalTo(1); // We just have one obj but getting it as an array.
//	  var lastIdeaArr = $firebaseArray(feedQuery);
//	  
	  
	  var lastPersonId,lastPersonOrder;
	  
	  lastPersonRef.on("value", function(snapshot) {
		  console.log('Last Person objec',snapshot.val());
		  lastPersonId =  snapshot.val().lastPersonId;
		  lastPersonOrder = snapshot.val().lastPersonOrder;
//		  $scope.feed = snapshot.val();
		}, function (errorObject) {
		  console.log("The read of LastPerson Object failed: " + errorObject.code);
		});


	  		  
	  // This function is called whenever the user reaches the bottom of needy people page
	  $scope.loadMore = function() {
		  console.log('loadmore fired');
			$scope.showSpinner = true;
	
		    // load the next item
		    scrollRef.scroll.next(1);
		    CtrlService.setFeeds($scope.items);
		  $scope.$broadcast('scroll.infiniteScrollComplete');
					$timeout(function() {$scope.showSpinner = false;} ,500);
			
	  };
	  
	  $scope.getDate = function(dateString) {
		  return new Date(dateString);
	  }
	  
	  $scope.isItemHot = function(feed) {
		  var hotNumber = JSON.parse(localStorage.get("hotnessNumber"));
		  if(hotNumber) {
			  
		  } else {
			   hotNumber = 3;
		  }
		  if(feed.commenters && feed.commenters.length>hotNumber) {
			  return true;
		  }
		  return false;
	  };
	  
	
	  function getRandomImg() {
		  var arrayOfImgs = ["http://images.huffingtonpost.com/2015-06-23-1435071172-9008959-brainstormidea.jpg",
		                     "http://static1.squarespace.com/static/530d75c7e4b0027bb049b777/t/5316ca37e4b02dddf7547c7f/1394002491278/5220e801b1396_light_bulb_idea.jpg",
		                     "http://1.bp.blogspot.com/-d6x0pLrpNyY/UA5Sz10gJaI/AAAAAAAAHH4/J7BPNgN2z6g/s1600/Idea_images.png",
		                     "http://images.huffingtonpost.com/2015-04-10-1428680355-4850708-HowMuchIsIdeaWorth-thumb.jpg",
		                     "https://www.ethos3.com/wp-content/uploads/2014/07/160231452.jpg",
		                     "http://rockypeaklc.com/blog/wp-content/uploads/2014/03/getinthemind.jpg",
		                     "http://media.bizj.us/view/img/5302701/idea*750xx3392-1908-0-182.jpg"];
		  var randomImg = arrayOfImgs[Math.floor(Math.random() * arrayOfImgs.length)];
		  return randomImg;
	  }
	  
	  $scope.launchNavigator = function(item) {
			var destLat, destLong;
			if(item.lat && item.long) {
				destLat = item.lat;
				destLong = item.long;
			} else {
				destLat = 38.8187820;
				destLong = -90.3056030;
			}
			console.log('Launching navigator', destLat + ', ' + destLong);
		  
		  var destination = [destLat, destLong];
			var start = "1 S Compton Ave, St. Louis, MO 63103";
		    $cordovaLaunchNavigator.navigate(destination, start).then(function() {
		      console.log("Navigator launched");
		    }, function (err) {
		      console.error(err);
		    });
		
	  }
	
	  
	  $scope.isItMine = function(item) {
		  if(PersonService.GetUserDetails().name == item.referrer) {
			  return true;
		  }
		  return false;
	  }
	  
	  
	 $scope.isTitleValid = function(title) {
		 if(title && title.length>8 && title.length<40) {
			 return true;
		 }
		 return false;
	 }
	 $scope.isDescValid = function(desc) {
		 if(desc && desc.length>100) {
			 return true;
		 }
		 return false;
	 }

	 
	 //// Share Needy People (Item) ////
	 
	 
	  $scope.share = function(item) {
		  console.log('sharing called',item);
		  
		  var blob = new Blob([item.cameraPic], {type: 'image/jpeg'});
		  var fileImg = new File([blob], 'image.jpeg');
		  
		  $cordovaSocialSharing
		    .share(item.article, "Teamster Article",  fileImg,"") // Share via native share sheet
		    .then(function(result) {
		      // Success!
		    	 console.log('sharing successfull');
		    }, function(err) {
		      // An error occured. Show a message to the user
		    	 console.log('sharing failed');
		    });
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

	//// Show correct thumbnail ////

	$scope.getThumbnail = function(person) {
		return CtrlService.getPicUrlFromCameraPic(person);
	}
	//// Show correct thumbnail ////

	

	$scope.isExceededStay = function(joiningDate) {
				var oneday = 24*60*60*1000;
				var numberOfDaysOnFin = (moment(new Date()) - moment(joiningDate))/oneday;
				if(numberOfDaysOnFin > 200) {
					return true;
				} else {
					return false;
				}
		}



    
	});