angular.module('starter.controllers')

	.controller('ChatCtrl2', function ($scope,
		store, $state, $stateParams,
		$ionicScrollDelegate, $firebaseArray, $firebase,
		FIREBASE_URL, PersonService, $timeout, CtrlService) {

		$scope.feedId = $stateParams.needyId;
		//	http://istarter.io/ionic-starter-messenger/#/room/room_f
		console.log('incidentId -->', $scope.incidentId);

		$scope.data = {
			messages: [],
			message: '',
			loading: true,
			showInfo: false
		};

	/*	var feedsRef = new Firebase(FIREBASE_URL + '/feeds');
		var feedQuery = feedsRef
			.orderByChild("id")
			.equalTo(parseInt($scope.feedId));  // String to Int. since id is 'int'
		var feed = $firebaseArray(feedQuery); */


		var messagesRef = new Firebase(FIREBASE_URL + '/messages');


		//////// [ Load Messages on page load ] //////////
		$scope.loadMessages = function () {

			console.log("Loading data for show ", $scope.feedId);

			var query = messagesRef
				//			.child("messages")
				.orderByChild("feedId")
				.equalTo($scope.feedId)
				.limitToLast(200);

			$scope.data.messages = $firebaseArray(query);

			$scope.data.messages.$loaded().then(function (data) {
				//			console.log("AngularFire $loaded");
				$scope.data.loading = false;
				if ($scope.data.messages.length && $scope.data.messages.length > 1) {
					CtrlService.addHotTopic($scope.feedId);
				}
				$ionicScrollDelegate.$getByHandle('show-page').scrollBottom(true);
			});
		};
		$scope.loadMessages();
		//////// [ Load Messages on page load ] //////////

	


		//////// [ Send Message ] //////////
		$scope.sendMessage = function () {

			if ($scope.data.message) {
				$scope.data.messages.$add({
					feedId: $scope.feedId,
					text: $scope.data.message,
					username: $scope.getName(),
					profilePic: $scope.getImg(),
					timestamp: new Date().getTime()
				});

				$scope.data.message = '';


				if (feed[0].commenters) {
					if (feed[0].commenters.indexOf($scope.getName() + '_' + $scope.getImg()) == -1) {
						// Not found so add commenter
						feed[0].commenters.push($scope.getName() + '_' + $scope.getImg());
						feed.$save(feed[0]);
					}
				} else {
					feed[0].commenters = [];
					feed[0].commenters.push($scope.getName() + '_' + $scope.getImg());
					feed.$save(feed[0]);
				}


				$ionicScrollDelegate.$getByHandle('show-page').scrollBottom(true);
			}

		};
		//////// [ Send Message ] //////////


	//////// [ Scroll after sending Message ] //////////
	// Added below line because view is not scrolling to the bottom on the recepient side when a new msg arrives
		messagesRef.on('child_added', function (childSnapshot, prevChildKey) {
			// code to handle new child.
			$timeout(function () {
				$ionicScrollDelegate.scrollBottom(true);
			}, 1000);
		});
		//////// [ Scroll after sending Message ] //////////


		///// [ Person who's loggeg in ] //////
		$scope.getName = function () {
			return PersonService.GetUserDetails().name;
		};
		


		$scope.isThisMe = function (name, profilePic) {
			if (PersonService.GetUserDetails().name == name && PersonService.GetUserDetails().img == profilePic) {
				return true;
			}
			return false;
		}

		$scope.getImg = function () {
			console.log(PersonService.GetAvatar());
			return PersonService.GetAvatar();
		};
	///// [ Person who's loggeg in ] //////

	
		$scope.logout = function () {
			console.log('logout');
			store.remove('token');
			store.remove('profile');
			store.remove('refreshToken');
			$state.go('login', {}, {
				reload: true
			});
		};



	})

