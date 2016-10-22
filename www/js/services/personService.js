angular.module('starter.controllers')

.factory('PersonService', function($http) {
	  var BASE_URL = "http://api.randomuser.me/";
	  var items = [];
	  var avatar,loginState;
	  var loggedinUser = {};

	  function shuffle(array) {
	    var currentIndex = array.length,
	      temporaryValue, randomIndex;

	    // While there remain elements to shuffle...
	    while (0 !== currentIndex) {

	      // Pick a remaining element...
	      randomIndex = Math.floor(Math.random() * currentIndex);
	      currentIndex -= 1;

	      // And swap it with the current element.
	      temporaryValue = array[currentIndex];
	      array[currentIndex] = array[randomIndex];
	      array[randomIndex] = temporaryValue;
	    }

	    return array;
	  }

	  return {
		
		  SetLoginState: function(val) {
			  loginState = val;
		  },
		  GetLoginState: function() {
			  return loginState;
		  },
		  SetUserDetails: function(name,img,email,displayName) {
			  loggedinUser.name = name;
			  loggedinUser.img = img;
			  loggedinUser.email = email;
			  loggedinUser.displayName = displayName;
		  },
		  GetUserDetails: function() {
			  return loggedinUser;
		  },
		  GetAvatar : function() {
			  return avatar;
		  },
		  SetAvatar: function(url) {
			  avatar = url;
		  },
	    GetFeed: function() {

	      return $http({
	        //			    url: BASE_URL+'?results=10',
	        url: 'data/data.json',
	        method: "GET",

	        headers: {
	          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	        }
	      }).then(function(response) {
	       return  items = response.data.feeds;
//	        return shuffle(items);
	      });
	      //			return $http.get(BASE_URL+'?results=10').then(function(response){
	      //				items = response.data.results;
	      //				return items;
	      //			});
	    },
	    GetNewUsers: function() {
	      //			return $http.get(BASE_URL+'?results=2').then(function(response){
	      //				items = response.data.results;
	      //				return items;
	      //			});
	      return $http({
	        url: 'data/more_data.json',
	        method: "GET",

	        headers: {
	          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	        }
	      }).then(function(response) {
	        return items = response.data.feeds;
//	        return shuffle(items);
	      });
	    },
	    GetOldUsers: function() {
	      //			return $http.get(BASE_URL+'?results=10').then(function(response){
	      //				items = response.data.results;
	      //				return items;
	      //			});
	      return $http({
	        //			    url: BASE_URL+'?results10',
	        url: 'data/data.json',
	        method: "GET",

	        headers: {
	          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	        }
	      }).then(function(response) {
	       return  items = response.data.feeds;
//	        return shuffle(items);
	      });
	    }
	  }
	})