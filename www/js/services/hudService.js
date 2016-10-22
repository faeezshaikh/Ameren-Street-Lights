angular.module('starter.controllers')

.factory('HudService', function($http) {
	  var items = [];
	  return {
	    GetHudAgents: function(lat,lon,distance) {
				var urlString = 'http://data.hud.gov/Housing_Counselor/searchByLocation?Lat=' + lat + '&Long=' + lon + '&Distance=' + distance + '&RowLimit=&Services=&Languages=';
	      return $http({
	        // url: 'data/hudagents.json',
					url: urlString,
	        method: "GET",

	        headers: {
	          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	        }
	      }).then(function(response) {
	       return  response;
	      });
	    }
	  }
	})