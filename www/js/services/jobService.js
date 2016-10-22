angular.module('starter.controllers')

.factory('JobService', function($http) {
	  var items = [];
	  return {
	    GetJobsForSkills: function(skill) {

//	      return $http({
//	        url: 'http://localhost:8100/#/jobs?publisher=2869392359069142&q=' + skill + '&as_any=painting&l=st.%20louis%2C+mo&sort=&radius=&st=&jt=&start=&limit=100&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2',
//	        method: "GET",
//	      }).then(function(response) {
//	    	  console.log('JobService returning',response);
//	       return  response;
//	      });
//
	    	
	    	var url = 'http://api.indeed.com/ads/apisearch?publisher=2869392359069142&q=' + skill + '&as_any=painting&l=st.%20louis%2C+mo&sort=&radius=&st=&jt=&start=&limit=100&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2';
	      return $http.get(url).then(function(response) {
		    	  console.log('JobService returning',response);
		       return  response;
		      });
	    }
	  }
	})