angular
	.module('atnowApp')
	.controller("TaskTableController", function($scope, Task){
	  $scope.displayedTasks=[].concat($scope.safeTasks);
	  $scope.itemsByPage=5;

	  $scope.emptyTasks = function(){
	    return $scope.safeTasks.length === 0;
	  }

});