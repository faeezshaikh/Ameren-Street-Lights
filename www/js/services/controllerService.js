angular.module('starter.controllers')

.service('CtrlService', function(localStorage,$cordovaLaunchNavigator,$cordovaGeolocation) {
	var feeds = [];
	var hotTopics = [];
	var hotnessNumber;
	var coords = {};

	var incidentObj = {};

	
	function deg2rad(deg) {
		  return deg * (Math.PI/180)
		}
	return {

		setIncident : function(obj) {
			incidentObj.data = obj;
			console.log('INSIDE Setting obj',incidentObj.data);
		},
		getIncident : function() {
			console.log('Returning',incidentObj.data);
			return incidentObj.data;
		},
		
		setFeeds : function(arr) {
			feeds = arr;
		},
		getFeeds : function() {
			return feeds;
		},
		// setCoords : function(lat,lon) {
		// 	coords.lat = lat;
		// 	coords.lon = lon;
		// },
		getCoords : function() {
			return coords;
		},
		 // Calculate formula from this SO link:
		 // http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
		getDistanceFromLatLonInMiles : function (lat1,lon1,lat2,lon2) {
			  var R = 6371; // Radius of the earth in km
			  var dLat = deg2rad(lat2-lat1);  // deg2rad below
			  var dLon = deg2rad(lon2-lon1); 
			  var a = 
			    Math.sin(dLat/2) * Math.sin(dLat/2) +
			    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
			    Math.sin(dLon/2) * Math.sin(dLon/2)
			    ; 
			  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
			  var d = R * c; // Distance in km
			  return d * 0.621371; // Distance in miles
		},
		
		launchNavigation: function(lat,lon) {

			  console.log('Launching navigator', lat + ', ' + lon);
			  
			  var destination = [lat, lon];
//				var start = "30 Plaza Square, St. Louis MO 63101";
				var start = [this.getCoords().lat,this.getCoords().lon];
			    $cordovaLaunchNavigator.navigate(destination, start).then(function() {
			      console.log("Navigator launched");
			    }, function (err) {
			      console.error(err);
			    });
			    
			    
		  
		},
		addHotTopic : function(topicId) {
			console.log('Added hot topic',topicId);
			hotTopics.push(topicId);
		},
		isTopicHot : function(topicId) {
			if(hotTopics.indexOf(topicId) == -1) {
				return false;
			}
			else {
				console.log(topicId + ' is hot');
				return true;
			}	
		},

		saveCurrentCoords : function() {
			   ////// Get current co-ords and save //////
					
					var posOptions = {timeout: 10000, enableHighAccuracy: false};
					$cordovaGeolocation
						.getCurrentPosition(posOptions)
						.then(function (position) {
								var lat  = position.coords.latitude
								var long = position.coords.longitude;
								console.log('Setting Co-ords',lat + ', ' + long);
								// setCoords(lat,long);
									coords.lat = lat;
									coords.lon = long;
								
						}, function(err) {
								console.log('Error in getting GeoLocation',err);
						});
					
					////// Get current co-ords /////
		},

		getPicUrlFromCameraPic : function(person) {
			if(person) {
					if(person.cameraPic) {
						return "data:image/jpeg;base64," + person.cameraPic;
					} else if(person.picture) {
						// console.log('picture present',person.picture);
						return person.picture;
					} else return "https://upload.wikimedia.org/wikipedia/commons/3/34/Pole_Tag_Crisfield_MD_USA.jpg";
					// https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS_iFfQCSUdpxGUXyivQashPRIvQ7O3nsvHzJdSqa7BRT6G1hPp
			}
		 else {
			// return "http://www.paulforattleboro.com/uploads/3/5/1/7/3517260/4716714_orig.jpg";
			return "img/hanshake.png";
		}
		}
	}
});
