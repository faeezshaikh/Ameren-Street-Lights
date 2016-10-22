// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',  'starter.controllers', 'auth0', 'angular-storage',
     'ngCordova', 'firebase','angularMoment','angular-storage','ngMap'])

.constant('FIREBASE_URL','https://homelesscare.firebaseio.com/')    

.run(function($ionicPlatform, auth, $rootScope, store,$ionicModal,$window,$http,$cordovaPush,$cordovaGeolocation) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

      
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams,$location) {
	    var requireLogin = toState.data.requireLogin;

	    if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
	      event.preventDefault();
	      // get me a login modal!
	      $ionicModal.fromTemplateUrl('templates/login.html', {
				scope : $rootScope
			}).then(function(modal) {
				$rootScope.explModal = modal;
				$rootScope.explModal.show();
			});
	    }
	  });


})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl',
     data: {
          requireLogin: true
        }
  })

  .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html',
            controller: ''
          }
        }
      })

  .state('app.needy', {
        url: '/needy',
        views: {
          'menuContent': {
            templateUrl: 'templates/needy.html',
            controller: 'NeedyCtrl'
          }
        }
      })
  .state('app.settings', {
    	   url: '/settings',
    	   views: {
    	          'menuContent': {
    	            templateUrl: 'templates/settings.html',
    	            controller: 'SettingsCtrl'
    	          }
    	        }
      })
     .state('app.share', {
        url: '/share',
        views: {
          'menuContent': {
            templateUrl: 'templates/share.html',
            controller: 'SocialShareCtrl'
          }
        }
      })

    .state('app.donate', {
        url: '/donate',
        views: {
          'menuContent': {
            templateUrl: 'templates/donate.html',
            controller: 'DonateCtrl'
          }
        }
      })

    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
 $urlRouterProvider.otherwise(function($injector, $location) {
        var state = $injector.get('$state');
        console.log('State name = ',state.current.name);
        if (state.current.name == '' || state.current.name == 'app.chat') {
        	
          state.go('app.playlists');
        } 
        else {
          state.go('app.playlists');  // Default landing page
        }
        return $location.path();
      });
});
