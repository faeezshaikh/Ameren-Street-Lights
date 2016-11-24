angular.module('starter.controllers')

.controller('TrucksCtrl', function($scope, $stateParams, $timeout, PersonService,ionicMaterialMotion, ionicMaterialInk,FIREBASE_URL,CtrlService,$firebaseArray,$ionicScrollDelegate,$window,ionicToast) {
  

    function animate() {
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

    }
   animate();
    $scope.expand = function() {
        console.log('animate called');
      animate();
    }

    $scope.reload = function() {
       $window.location.reload();
    }

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
    $scope.statusParam = $stateParams.status;

    console.log('incidentID -->', $scope.incidentID);
    console.log('statusParam -->', $scope.statusParam);

    if($scope.statusParam == 'yes') foo();
  
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
          foo();
            
        }
        

        function foo() {
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
  

        $scope.dispatchTruck = function() {
            ionicToast.show('Truck dispatched successfully.', 'bottom', false, 1500);
        }
})


;