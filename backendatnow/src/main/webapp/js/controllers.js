'use strict';


var atnowApp = angular.module('atnowApp', ['smart-table']);

atnowApp.controller('TaskListCtrl', function($scope) {
	gapi.client.atnow.tasks.list().execute(
		function(resp){
			$scope.$apply(function(){
				$scope.tasks=resp.items || [];
			});
		});
});