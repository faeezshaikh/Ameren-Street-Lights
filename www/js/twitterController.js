angular.module('starter.controllers')
.controller('TwitterCtrl', function($scope,$window,$timeout,$firebaseArray){
	
	  var baseRef = new Firebase('https://teamsterapp.firebaseio.com/tweets');

	  var scrollRefT = new Firebase.util.Scroll(baseRef, 'orderId');
	  $scope.tweets = $firebaseArray(scrollRefT);
	  scrollRefT.scroll.next(1);
	  
	  scrollRefT.on('child_added', function(snap) {
		   console.log('added child', snap.key());
		});


	  // This function is called whenever the user reaches the bottom
	  $scope.loadMore = function() {
		  console.log('loadmore tweets fired');

		    // load the next contact
		  scrollRefT.scroll.next(1);
		  $scope.$broadcast('scroll.infiniteScrollComplete');
	  };
	  
	  $scope.doRefresh = function() {
		  console.log('refresged');
		  scrollRefT.scroll.next(1);
		  $scope.$broadcast('scroll.refreshComplete');
	  }
	  $scope.cancelFilter = function() {
		  $scope.tweets = $firebaseArray(scrollRefT);
		  
	  }
	
})

;