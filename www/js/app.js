// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.cloud', 'starter.controllers', 'auth0', 'angular-storage',
     'ngCordova', 'firebase','angularMoment','angular-storage','ngMap','ionic-material'])

.constant('FIREBASE_URL','https://homelesscare.firebaseio.com/')    
/*.directive('groupedRadio', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      model: '=ngModel',
      value: '=groupedRadio'
    },
    link: function(scope, element, attrs, ngModelCtrl) {
      element.addClass('button');
      element.on('click', function(e) {
        scope.$apply(function() {
            ngModelCtrl.$setViewValue(scope.value);
        });
      });

      scope.$watch('model', function(newVal) {
        element.removeClass('button-balanced');
        if (newVal === scope.value) {
          element.addClass('button-balanced');
        }
      });
    }
  };
})  */
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

.config(function($stateProvider, $urlRouterProvider,$ionicCloudProvider,$ionicConfigProvider) {


  ////////// PUSH NOTIFICATION //////////

 $ionicCloudProvider.init({
    "core": {
      "app_id": "4f93e9b7"
    },
    "push": {
      "sender_id": "468876054523",
      "pluginConfig": {
        "ios": {
          "badge": true,
          "sound": true
        },
        "android": {
          "iconColor": "#343434"
        }
      }
    }
  });

    ////////// PUSH NOTIFICATION //////////
  
      // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

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

  // .state('app.needy', {
  //       url: '/needy',
  //       views: {
  //         'menuContent': {
  //           templateUrl: 'templates/needy.html',
  //           controller: 'NeedyCtrl'
  //         }
  //       }
  //     })

  // .state('app.needyDetails', {
  //       url: '/needy/:needyId',
  //       views: {
  //         'menuContent': {
  //           templateUrl: 'templates/needyDetails.html',
  //           controller: 'NeedyDetailsCtrl'
  //         }
  //       }
  //     })

  //           .state('app.needyChat', {
  //       url: '/needyChat/:needyId',
  //       views: {
  //         'menuContent': {
  //           templateUrl: 'templates/needyChat.html',
  //           controller: 'NeedyChatCtrl'
  //         }
  //       }
  //     })

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

  

    .state('app.streetLights', {
        url: '/streetLights',
        views: {
          'menuContent': {
            templateUrl: 'templates/streetLights.html',
            controller: 'StreetLightsCtrl'
          }
        }
      })

       .state('app.heatmap', {
        url: '/heatmap',
        views: {
          'menuContent': {
            templateUrl: 'templates/heatmap.html',
            controller: 'HeatMapCtrl'
          }
        }
      })


  
      .state('app.trucks', {
        url: '/trucks/:incidentId',
        views: {
            'menuContent': {
                templateUrl: 'templates/trucks.html',
                controller: 'TrucksCtrl'
            },
            'fabContent': {
                template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);
                }
            }
        }
    })

    //  .state('app.chat', {
    //     url:  '/chat/:incidentId',
    //     views: {
    //         'menuContent': {
    //             templateUrl: 'templates/chat.html',
    //             controller: 'ChatCtrl'
    //         },
    //         'fabContent': {
    //             template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
    //             controller: function ($timeout) {
    //                 $timeout(function () {
    //                     document.getElementById('fab-profile').classList.toggle('on');
    //                 }, 800);
    //             }
    //         }
    //     }
    // })


    //  .state('app.activity', {
    //     url: '/activity',
    //     views: {
    //         'menuContent': {
    //             templateUrl: 'templates/activity.html',
    //             controller: 'ActivityCtrl'
    //         },
    //         'fabContent': {
    //             template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
    //             controller: function ($timeout) {
    //                 $timeout(function () {
    //                     document.getElementById('fab-profile').classList.toggle('on');
    //                 }, 800);
    //             }
    //         }
    //     }
    // })
  
  
   

  ;
  // if none of the above states are matched, use this as the fallback
 $urlRouterProvider.otherwise(function($injector, $location) {
        var state = $injector.get('$state');
        console.log('State name = ',state.current.name);
        if (state.current.name == '' || state.current.name == 'app.chat') {
        	
          state.go('app.streetLights');
        } 
        else {
          state.go('app.streetLights');  // Default landing page
        }
        return $location.path();
      });
});
