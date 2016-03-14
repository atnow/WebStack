angular.module('atnowApp').controller("TaskController", function($log, $scope, $stateParams, $rootScope, $state, $uibModal, Task, taskDetail, User, TaskCode) {
  $scope.taskCode = TaskCode;
  $scope.task = taskDetail;
  $scope.isCompleter = false;
  if (taskDetail.accepted && (typeof taskDetail.accepter !== 'undefined' && taskDetail.accepter !== null) 
    && taskDetail.accepter.id === $rootScope.sessionUser.id) {
    $scope.isCompleter = true;
  }

  $scope.isRequester = false;
  if (taskDetail.requester.id === $rootScope.sessionUser.id) {
    $scope.isRequester = true;
  }

  $scope.taskStatus = '';
  if (!$scope.task.accepted) {
    $scope.taskStatus = 'Unclaimed';
  } else if ($scope.task.accepted && !$scope.task.completed) {
    $scope.taskStatus = 'In Progress';
  } else if ($scope.task.completed && !$scope.task.confirmed) {
    $scope.taskStatus = 'Awaiting Confirmation';
  } else if ($scope.task.confirmed) {
    $scope.taskStatus = 'Complete';
  }

  $scope.completeTask = function(){
    $scope.taskCode.completeTask($scope.task);
  }

  $scope.relinquishTask = function(){
    $scope.taskCode.relinquishTask($scope.task);
  }
  
  $scope.claimTask = function(){
    $scope.taskCode.claimTask($scope.task, $rootScope.sessionUser);
  };

  $scope.confirmTask = function(){
    $scope.taskCode.confirmTask($scope.task, $rootScope.sessionUser);
  };

  $scope.deleteTask = function() {
    var result = $scope.taskCode.deleteTask($scope.task, $rootScope.sessionUser);
    if (result == true) {
      $scope.taskCode.reload('dashboard');
    }
  }

  $scope.reportUser = function() {
    $scope.taskCode.reportUser($scope.task);
  };

});
