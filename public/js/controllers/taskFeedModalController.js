angular
  .module('atnowApp')
  .controller('TaskFeedModalController', function ($scope, $uibModalInstance, $rootScope, task, $log, $uibModal, Task, $state, $timeout, TaskCode){
  $scope.taskCode = TaskCode;
  $scope.task = task;
  $scope.taskName = task.get('title');
  $scope.accepted = task.get('accepted');
  $scope.price = task.get('price');
  $scope.location = task.get('location');
  if(!$scope.location){
    $scope.location="N/A";
  }
  $scope.description = task.get('description');


  $scope.isCompleter = false;
  if (task.accepted && (typeof task.accepter !== 'undefined' && task.accepter !== null)
    && task.accepter.id === $rootScope.sessionUser.id) {
    $scope.isCompleter = true;
  }

  $scope.isRequester = false;
    if (task.requester.id === $rootScope.sessionUser.id) {
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
    $scope.cancel();
    $scope.taskCode.completeTask($scope.task);
  }

  $scope.relinquishTask = function(){
    $scope.taskCode.relinquishTask($scope.task);
    $scope.cancel();
  }

  $scope.claimTask = function(){
    $scope.cancel();
    $scope.taskCode.claimTask($scope.task, $rootScope.sessionUser);
  };

  $scope.confirmTask = function(){
    $scope.cancel();
    $scope.taskCode.confirmTask($scope.task, $rootScope.sessionUser);

  };

  $scope.reportUser = function() {
    $scope.cancel();
    $scope.taskCode.reportUser($scope.task);
  };

  $scope.deleteTask = function() {
    var result = $scope.taskCode.deleteTask($scope.task, $rootScope.sessionUser);
    if (result == true) {
      $scope.cancel();
      $scope.taskCode.reload('dashboard');
    }
  }

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});
