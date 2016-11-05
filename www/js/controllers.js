angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,
          auth, $state, $window, $firebase, $firebaseAuth,$rootScope,PersonService,FIREBASE_URL,CtrlService,$ionicPush) {


      $scope.options = {
        content: '=',
        isOpen: false,
        toggleOnClick: true,
        background: 'red',
        items: [
          {
            content: 'About',
            background: 'blue',
            onclick: function () {console.log('About');}

          },{
            content: '<span class="fa fa-facebook"></span>Facebook',
            background: '#3b5998',
            onclick: function () {console.log('About');}
          },{
            content: 'Twitter',
            background: 'yellow',
            onclick: function () {console.log('About');}
          },{
            content: 'Github',
            onclick: function () {console.log('About');}
          }
        ]
      };

 ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

  // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

   

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

 ////////////////////////////////////////
    // Layout Methods End
    ////////////////////////////////////////


   CtrlService.saveCurrentCoords();
	 $scope.date = new Date(); // for the chat page
    var chatRef = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(chatRef);

    
    $scope.ameren = {'username':'','password':''};
    
    $scope.isFormValid = function() {
  	  if($scope.ameren.username &&  $scope.ameren.password)  {
  		  return true;
  	  }
  	  return false;
    }
    
    
    $scope.login = function(socialPlatform) {
      console.log('loging attempt');
      
      $scope.loginProgress = true;
      auth.$authWithOAuthPopup(socialPlatform).then(function(authData) {
        console.log("Logged in as:", authData.uid);
        $scope.loggedIn = true;
        $scope.loginProgress = false;
        PersonService.SetLoginState(true);
      }).catch(function(error) {
        console.log("Authentication failed:", error);
        $scope.loginProgress = false;
        console.log(error);
        $scope.msg = "";
        $("#loginPage").effect("shake", {
          times: 4
        }, 1000);
      });
    }
    
    $scope.submitForm = function() {
  	    $("#loginPage").effect("shake", {
  	        times: 4
  	      }, 1000);
    }

    $scope.logout = function() {
  	  PersonService.SetLoginState(false);
      chatRef.unauth();
      $scope.msg = "Signing out of chat..";
      $scope.loggedIn = false;
      $scope.loginProgress = true;
      $state.go('app.feeds'); // adding this for device.. location.href doesnt work on device
      $window.location.reload();

    }
    
    auth.$onAuth(function(authData) {
      // Once authenticated, instantiate Firechat with our user id and user name
      if (authData) {
        $scope.loginProgress = false;
        $scope.loggedIn = true;
        $rootScope.currentUser = "user";
        $scope.explModal.hide();
//        $window.location.href = "#/app/chat/";
        console.log('Chat controller. State name = ',$state.current.name);
        if($state.current.name == 'app.chat') {
      	  $state.go('app.chat');
//      	  $window.location.href = "#/app/chat/";
        } else {
      	  $state.go('app.streetLights');
      	 // $window.location.href = "#/app/feeds";
        }
        if (authData.provider == 'facebook') {
          $scope.userName = authData.facebook.displayName;
          $scope.userImg = authData.facebook.profileImageURL;
          $scope.userEmail = authData.facebook.email; // Email works only if user has exposed.
          PersonService.SetAvatar(authData.facebook.profileImageURL);
          PersonService.SetUserDetails($scope.userName,$scope.userImg,$scope.userEmail,authData.facebook.displayName);
        }
        if (authData.provider == 'twitter') {
          $scope.userName = authData.twitter.displayName;
          $scope.userImg = authData.twitter.profileImageURL;
          $scope.userEmail = authData.twitter.email;
          PersonService.SetAvatar(authData.twitter.profileImageURL);
          PersonService.SetUserDetails($scope.userName,$scope.userImg,$scope.userEmail,authData.twitter.displayName);
        }
        if (authData.provider == 'google') {
          $scope.userName = authData.google.displayName;
          $scope.userImg = authData.google.profileImageURL;
          $scope.userEmail = authData.google.email;
          PersonService.SetAvatar(authData.google.profileImageURL);
          PersonService.SetUserDetails($scope.userName,$scope.userImg,$scope.userEmail,authData.google.displayName);
        }
        if (authData.provider == 'github') {
            $scope.userName = authData.github.displayName;
            $scope.userImg = authData.github.profileImageURL;
            $scope.userEmail = authData.github.email;
            PersonService.SetAvatar(authData.github.profileImageURL);
            PersonService.SetUserDetails($scope.userName,$scope.userImg,$scope.userEmail,authData.github.displayName);
          }
        
    
        
          // Removing firechat.
        // var chat = new FirechatUI(chatRef, angular.element(document.querySelector('#firechat-wrapper')));
        // chat.setUser(authData.uid, authData[authData.provider].displayName);
      }
    });
    
    
    
    $scope.isUserAdmin = function() {
    	if($scope.userName && $scope.userName.indexOf('Faeez')==-1) {
    		return false;
    	}
    	return true;
    }

  $scope.name = PersonService.GetUserDetails().name;



    //////// PUSH NOTIFICATION ////

    $ionicPush.register().then(function(t) {
      return $ionicPush.saveToken(t);
    }).then(function(t) {
      console.log('Token saved:', t.token);
    // alert('Token saved:' + t.token);
    });



    $scope.$on('cloud:push:notification', function(event, data) {
      var msg = data.message;
      alert('Push Notification: \n' + msg.title + ': ' + msg.text);
    });
  //////// PUSH NOTIFICATION ////




})


.controller('TrucksCtrl', function($scope, $stateParams, $timeout, PersonService,ionicMaterialMotion, ionicMaterialInk,FIREBASE_URL,CtrlService,$firebaseArray,$ionicScrollDelegate) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();


    //// Get Logged in user details ////
    var user = PersonService.GetUserDetails();
    $scope.imgUrl = user.img;
    $scope.name = user.name;
    //// Get Logged in user details ////


    $scope.showTrucks = true;
    $scope.showChat = false;
    $scope.showActivity = false;
    $scope.trucksStyle={color:'#A3FD93'};


    //// For the selected incident get details /////
    $scope.incidentID = $stateParams.incidentId;
    console.log('incidentID -->', $scope.incidentID);
  
    var incidentRef = new Firebase(FIREBASE_URL + '/streetlights/' + $scope.incidentID);
	var incident;
	  
	incidentRef.on("value", function(snapshot) {
          incident = snapshot.val();
		  console.log('Incident object',incident);
            
	        $scope.backgroundImg = CtrlService.getPicUrlFromCameraPic(incident);
                  CtrlService.setIncident(incident);
		}, function (errorObject) {
		  console.log("The read of Incident Object failed: " + errorObject.code);
	});
    //// For the selected incident get details /////   

        $scope.chatSelected = function() {
                $scope.showTrucks = false;
                $scope.showActivity = false;
                $scope.showChat = true;

                $scope.chatStyle={color:'#A3FD93'};
                $scope.trucksStyle={color:''};
                $scope.activityStyle={color:''};
                $ionicScrollDelegate.$getByHandle('show-page').scrollBottom(true);
        }


        $scope.trucksSelected = function() {
                 $scope.showTrucks = true;
                $scope.showChat = false;
                $scope.showActivity = false;
                $scope.chatStyle={color:''};
                $scope.trucksStyle={color:'#A3FD93'};
                $scope.activityStyle={color:''};    
                
            
        }

        $scope.activitySelected = function() {
                 $scope.showTrucks = false;
                $scope.showChat = false;
                $scope.showActivity = true;
                $scope.chatStyle={color:''};
                $scope.trucksStyle={color:''};
                $scope.activityStyle={color:'#A3FD93'};  
            
        }
        
        



        ///// [ Chat Start ] ////

        $scope.data = {
			messages: [],
			message: '',
			loading: true,
			showInfo: false
		};



		//////// [ Load Messages on page load ] //////////
        	var messagesRef = new Firebase(FIREBASE_URL + '/messages');
		$scope.loadMessages = function () {

			console.log("Loading data for show ", $scope.feedId);

			var query = messagesRef
				//			.child("messages")
				.orderByChild("incidentId")
				.equalTo($scope.incidentID)
				.limitToLast(200);

			$scope.data.messages = $firebaseArray(query);

			$scope.data.messages.$loaded().then(function (data) {
				//			console.log("AngularFire $loaded");
				$scope.data.loading = false;
				if ($scope.data.messages.length && $scope.data.messages.length > 1) {
					CtrlService.addHotTopic($scope.feedId);
				}
				
			});
		};
		$scope.loadMessages();
		//////// [ Load Messages on page load ] //////////



		//////// [ Send Message ] //////////
		$scope.sendMessage = function () {

			if ($scope.data.message) {
				$scope.data.messages.$add({
					incidentId: $scope.incidentID,
					text: $scope.data.message,
					username: $scope.name ,
					profilePic: $scope.imgUrl,
					timestamp: new Date().getTime()
				});

				$scope.data.message = '';

				$ionicScrollDelegate.$getByHandle('show-page').scrollBottom(true);
			}

		};
		//////// [ Send Message ] //////////

        ///// [ Chat End ] ////
  
})



;