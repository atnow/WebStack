angular.module('atnowApp').controller("TaskController", function($log, $scope, $stateParams, $rootScope, $state, $uibModal, Task, taskDetail, User) {
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

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/js/views/task/TaskRating.html',
      controller: 'TaskModalController',
      size: 'sm',
      resolve: {
        reviewUser: function (User) {
          var query = new Parse.Query(User);
          query.include('rating');
          return query.get($scope.task.requester.id).then({
            success: function(result) {
              console.log(result);
              return result;
            },
            error: function(error) {
              alert("Error: " + error.code + " " + error.message);
              return error;
            }
          });
        }
      }
    });

    modalInstance.result.then(function () {
      $scope.task.set("completed", true);
      var Notification = Parse.Object.extend("Notification");
      var notification = new Notification();
      notification.save({type:"completed", task: $scope.task, isRead: false, owner: $scope.task.get("requester")});   
      $scope.task.save();
    });
  }

  $scope.relinquishTask = function(){
    $scope.task.set("accepter", null);
    $scope.task.set("accepted", false);
    $scope.task.save();
    $state.go("app.feed");
  }
  
  $scope.claimTask = function(){
    $scope.task.set("accepter", $rootScope.sessionUser);
    $scope.task.set("accepted", true); 
    var Notification = Parse.Object.extend("Notification");
    var notification = new Notification();
    notification.save({type:"claimed", task: $scope.task, isRead: false, owner: $scope.task.get("requester")});    
    $scope.task.save();
    $state.go('app.dashboard', {'userId': $rootScope.sessionUser.id});
  };

  $scope.confirmTask = function(){
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/js/views/task/TaskRating.html',
      controller: 'TaskModalController',
      size: 'sm',
      resolve: {
        reviewUser: function (User) {
          var query = new Parse.Query(User);
          query.include('rating');
          return query.get($scope.task.accepter.id).then({
            success: function(result) {
              console.log(result);
              return result;
            },
            error: function(error) {
              alert("Error: " + error.code + " " + error.message);
              return error;
            }
          });
        }
      }
    });

    modalInstance.result.then(function () {
      var Notification = Parse.Object.extend("Notification");
      var notification = new Notification();
      notification.save({type:"confirmed", task: $scope.task, isRead: false, owner: $scope.task.accepter});
      $scope.task.set("confirmed", true);
      $scope.task.save();
      $state.go('app.dashboard', {'userId': $rootScope.sessionUser.id});
    });
  };

  $scope.reportUser = function() {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/js/views/task/Report.html',
      controller: 'TaskModalController',
      resolve: {
        reviewUser: function (User) {
          var query = new Parse.Query(User);
          return query.get($scope.task.accepter.id).then({
            success: function(result) {
              console.log(result);
              return result;
            },
            error: function(error) {
              alert("Error: " + error.code + " " + error.message);
              return error;
            }
          });
        }
      }
    });

    modalInstance.result.then(function () {
      $scope.task.set("accepter", null);
      $scope.task.set("accepted", false);
      $scope.task.set("completed", false);
      $scope.task.save();
    });
  };

});
