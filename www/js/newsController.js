angular.module('starter.controllers')
.controller('NewsCtrl', function($scope, auth, store, $state, $timeout, HudService,$stateParams, $cordovaToast,$firebaseArray,CtrlService,$cordovaSocialSharing,localStorage,$ionicModal,$ionicScrollDelegate,FIREBASE_URL,$cordovaCamera,$cordovaGeolocation,$cordovaLaunchNavigator,$window,$rootScope,NgMap) {
	
		$scope.newsItems = [{
      img: 'http://i.huffpost.com/gen/2146722/images/n-HOMELESS-RICH-NEW-YORK-628x314.jpg',
      url: 'http://www.huffingtonpost.com/2014/10/08/new-york-homelessness-billionaires_n_5953464.html?utm_hp_ref=homelessness',
      headline : 'Income inequality is in full swing around the Big Apple. The number of homeless people living in shelters broke a record this week, according to WNYC, with over 56,000 individuals in need of stable housing.'
    },{
      img: 'http://i.huffpost.com/gen/2146956/images/n-RICK-COLE-628x314.jpg',
      url: 'http://www.huffingtonpost.com/2014/10/09/pastor-rick-cole-homeless-sacramento_n_5954288.html?utm_hp_ref=homelessness',
      headline : 'A California megachurch pastor is putting his faith to work by getting to know the often-forgotten members of his city.The Rev. Rick Cole, of Capital Christian Center, is spending two weeks sleeping on the streets of Sacramento and has raised more than $100,000 for a winter shelter program.'
    },{
      img: 'http://img.huffingtonpost.com/asset/scalefit_630_noupscale/580642991a00008f205ba32d.jpeg?cache=cjudvnimhn',
      url: 'http://www.huffingtonpost.com/entry/kinshasas-homeless-girls-are-resorting-to-prostitution-to-survive_us_5806422be4b0b994d4c186d7?utm_hp_ref=homelessness',
      headline : 'Of the 25,000 street children in Congo’s capital, the majority are young men. But while boys can make money through manual labor, girls often find that prostitution and exploitation are their only options for survival.KINSHASA, Congo – When Cecilia’s parents died suddenly in 2009'
    },{
      img: 'https://scontent-ord1-1.xx.fbcdn.net/t31.0-8/p960x960/14691269_970325159779484_7715317993895549746_o.jpg',
      url: 'http://www.huffingtonpost.com/entry/share-a-meal-food-truck-free-burritos-homeless-los-angeles_us_57ffb603e4b05eff55821f3b?utm_hp_ref=homelessness',
      headline : 'This food truck is serving up free burritos, wrapped in community kindness, to people in need.The Share A Meal food truck, run by nonprofit Khalsa Peace Corps, gives out hot burritos to homeless people around Los Angeles five days a week. Volunteers make anywhere from 150 to 250 burritos per night, volunteer Alejandro Garcia told The Huffington Post.'
    }];
		$scope.openSite = function(link) {
        window.open(link, '_system', 'location=yes'); 
        return false;
	}
	
	
});