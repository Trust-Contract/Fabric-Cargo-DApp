// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('loginapp', []);

// Angular Controller
app.controller('appController', function($scope, appFactory){

	$("#login_rtnval").hide();
	$("#register_rtnval").hide();
	$("#logout_rtnval").hide();

  $scope.login = function(){
		appFactory.clogin($scope.logn, function(data){
			$scope.login_rtn = data;
			console.log("test");
			$("#login_rtnval").show();
		});
	}

	$scope.register = function(){
		appFactory.cregister($scope.reg, function(data){
			$scope.register_rtn = data;
			$("#register_rtnval").show();
		});
	}

	$scope.logininfo = function(){
		appFactory.clogininfo(function(data){
			$scope.login_data = data;
		});
	}

	$scope.logout = function(){
		appFactory.clogout(function(data){
			$scope.logout_data = data;
			$("#logout_rtnval").show();
		});
	}
});

// Angular Factory
app.factory('appFactory', function($http){

	var factory = {};

	factory.clogin = function(data, callback){
		console.log(data);
		$http.post('/login/', data).success(function(output){
			console.log(output);
			callback(output)
			window.location.href = 'http://localhost:8000';
		});

	}

	factory.cregister = function(data, callback){
        // console.log(data);
        if(data.password === data.pw_confirm){
            $http.post('/register/', data).success(function(output){
				console.log(output);
				if(output.success === true){
					callback(output)
					window.location.href = 'http://localhost:8000';
				}
            });
        }
		
	}

	factory.clogininfo = function(callback){
    	$http.get('/logininfo/').success(function(output){
			callback(output)
		});
	}

	factory.clogout = function(callback){
    	$http.get('/logout/').success(function(output){
			callback(output)
		});
	}
	return factory;
});
