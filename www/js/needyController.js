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

  //////////// [ Likes Start ] /////////////////
	  function loadLikesFromCache() {
		  var likedFeeds = JSON.parse(localStorage.get("liked"));
		  if(likedFeeds) {
			  return likedFeeds
		  } else {
			  var a = []
			  if(a instanceof Array) {
				  return a;
			  } 
		  }
	  }

	  $scope.isLiked = function(feed) {
		  var likedFeeds = loadLikesFromCache();
			  if(likedFeeds.indexOf(feed.id) == -1) {
				  // Not found so not liked
				  	return false;
			  } else {
				  return true;
			  }
	  }
		  
	  $scope.updateLikes = function(index,obj) {
		  var likedFeeds = loadLikesFromCache();
		  
		  if($scope.isLiked(obj))  {
			  $scope.liked=false
			  likedFeeds.splice(likedFeeds.indexOf(obj.id),1);
			  obj.likes --;
		  }
		  else { // not liked yet, so go ahead and like it
			
			  $scope.liked= true;
			  obj.likes++;
			  likedFeeds.push(obj.id);
		  }
		  localStorage.set("liked",JSON.stringify(likedFeeds));
		  $scope.items[index] = obj;
		  $scope.items.$save(obj);   // synchronize it with Firebase array
	  }
	  
	  //////////// [ Likes End ]/////////////////

	  		  
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


		//////// [Add New Needy] ////////


		 $ionicModal.fromTemplateUrl('templates/addNewNeedy.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.composeIdeaModal = modal;
		});

		$scope.openComposer = function() {
		  $scope.newPerson = {};
			$scope.removePicture();
		 	$scope.composeIdeaModal.show();
	  }
  
	  $scope.closeComposer = function() {
		  $scope.composeIdeaModal.hide();
		  $scope.editIdeaModal.hide();
	  }
	  
		  		//// Confirmation Modal ////////
	  $ionicModal.fromTemplateUrl('templates/confirmationModal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.confirmationModal = modal;
		});
	  

	  $scope.openConfirmation = function() {
		  $scope.confirmationModal.show();
	  }
	    $scope.closeConfirmation = function() {
		  $scope.confirmationModal.hide();
	  }


			$scope.autoFill = function () {
				$scope.newPerson = {
					name: 'James McNeil',
					dob: new Date('Nov 17, 1980'),
					phone: '314-876-3452',
					email: 'ds@gmail.com',
					address: '30 Plaza Sq. St Louis MO 63010',
					id: lastPersonId + 1,
					skills: 'plumber, electrician',
					story: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
					lastUpdated: new Date().toString(),
					likes: 0,
					willingToWork: true,
					cameraPic: $scope.imageData || null
				};
			}

 		$scope.finalSubmit = function() {
		  $scope.confirmationModal.hide();
		  $scope.composeIdeaModal.hide();
		  var obj = {
				  // name: PersonService.GetUserDetails().name, // We could do that, but if admin wants to secretly update an idea it would expose the admin
					name: $scope.newPerson.name,
					dob: $scope.newPerson.dob.toString(),
					phone:$scope.newPerson.phone,
					email:$scope.newPerson.email,
					address:$scope.newPerson.address || 'none',
				  id:lastPersonId+1,
					skills: $scope.newPerson.skills,
					story:$scope.newPerson.story,
				  order:lastPersonOrder-1,
				  lastUpdated: new Date().toString(),
				 // picture: {thumbnail : PersonService.GetUserDetails().img},
				  likes:0,
				  cameraPic:$scope.imageData || null,
					balance:0,
					joiningDate: new Date().toString(),
					referrer: PersonService.GetUserDetails().name
				  };
		  
		  
					var posOptions = {timeout: 10000, enableHighAccuracy: false};
					$cordovaGeolocation
						.getCurrentPosition(posOptions)
						.then(function (position) {
								var lat  = position.coords.latitude
								var long = position.coords.longitude;
								
								obj.lat = lat;
								obj.long = long;
								
							console.log('Final object adding',$scope.newPerson);
								
							$scope.items.$add(obj);   // Adding to Firebase after getting current coords.
							
							var fredNameRef = new Firebase(FIREBASE_URL + '/lastPerson');
							fredNameRef.update({ lastPersonId: lastPersonId+1, lastPersonOrder: lastPersonOrder-1 });
							
							$ionicScrollDelegate.$getByHandle('feeds-page').scrollTop(true);
						}, function(err) {
							// error
								console.log('Error in getting GeoLocation',error);
						});
	
	  }
		//////// [Add New Needy Ends] ////////


	////////// [ Edit Person ] /////////////////

	//  $scope.cocs = ["St. Patrick Center", "St. Martha", "St. Louis County"];
	     $scope.SimpleData =["St. Patrick Center", "St. Martha", "St. Louis County"];
      $scope.SimpleSelectedData = "St. Patrick Center";

	 var services = [];
	  $ionicModal.fromTemplateUrl('templates/editIdea.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.editIdeaModal = modal;
		});
	  
	 
	  $scope.openEditor = function(item) {
				$scope.idToEdit = item.$id;
				$scope.removePicture();
				$scope.editPerson = {
						name: item.name,
						imageData: item.imageData,
						dob: new Date(item.dob),
						phone: item.phone,
						email:item.email || 'faeez@awesome.com',
						address:item.address,
						skills: item.skills,
						story:	item.story,
						picture: CtrlService.getPicUrlFromCameraPic(item),
				  	lastUpdated: new Date().toString(),
				  	// cameraPic:$scope.imageData || null,
						joiningDate: item.joiningDate.toString(),
						referrer: item.referrer,
						facilityName:'',
				};

				if(item.skills) $scope.editPerson.willingToWork = true;
		
				$scope.editPerson.food = false;
				$scope.editPerson.medical = false;
				$scope.editPerson.clothing = false;
				
				$scope.editIdeaModal.show();
	  }
	  
		  $scope.saveEdit = function() {
					$scope.editIdeaModal.hide();

					var coc = $scope.SimpleSelectedData;
					console.log('Selected Coc:', coc);
					
					var notes = $scope.editPerson.notes;
					if ($scope.editPerson.food) {
						var service = {service: 'Food',coc: coc,date:new Date().toString(),notes:notes};
						services.push(service);
					}
					if ($scope.editPerson.medical) {
						var service = {service: 'Medical',coc: coc,date:new Date().toString(),notes:notes};
						services.push(service);
					}
						if ($scope.editPerson.clothing) {
						var service = {service: 'Clothing',coc: coc,date:new Date().toString(),notes:notes};
						services.push(service);
					}
					console.log('Services: ', services);
					
					var obj = {
							name: $scope.editPerson.name,
							dob: $scope.editPerson.dob.toString(),
							phone: $scope.editPerson.phone,
							email:$scope.editPerson.email,
							address:$scope.editPerson.address || 'none',
							skills: $scope.editPerson.skills,
							story:	$scope.editPerson.story,
							lastUpdated: new Date().toString(),
							cameraPic:$scope.imageData || null, ////// ???
							referrer: $scope.editPerson.referrer,    ////// ????
							services: services
					};
					var url = FIREBASE_URL + '/needy/' + $scope.idToEdit;
					var fredNameRef = new Firebase(url);
					fredNameRef.update(obj);
	  }

		$scope.autoFillEditPage = function() {
			$scope.editPerson.notes = "Helped at St Patrick Center";
		}
		////////// [ Edit Person End ] /////////////////

	 
		/////////// [ Delete Homeless Person ] //////////////
	  $ionicModal.fromTemplateUrl('templates/deletePersonConfirmation.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.deleteIdeaModal = modal;
		});
	  
	  $scope.openDeleteConfirmation = function(item) {
		  $scope.deleteIdeaModal.show();
		  ideaToDelete = item;
	  }
	  $scope.closeDeleteConfirmation = function() {
		  $scope.deleteIdeaModal.hide();
	  }
	  
	  $scope.deletePerson = function() {
		  $scope.items.$remove(ideaToDelete);
		  $scope.deleteIdeaModal.hide();
	  }
	  
		/////////// [ Delete Homeless Person End	 ] //////////////

    
	});