angular.module('atnowApp').controller('NavBarController', function($scope, $state, $rootScope, $log, $location, myNotifications, $uibModal, Task) {
  $scope.signOut = function(){
    Parse.User.logOut();
    $rootScope.sessionUser=Parse.User.current();
    $state.go("landing");
  }

  $scope.userNotifications = myNotifications;

  $scope.noNotifications = function(){
    return myNotifications && myNotifications.length===0;
  }

  $scope.openTaskModal = function(task, Task){
    console.log(task);
  var modalInstance = $uibModal.open({
    animation: true,
    templateUrl: '/js/views/task/TaskModal.html',
    windowClass: 'app-modal-window',
    controller: 'TaskFeedModalController',
    resolve: {
      task: function (Task) {
              var query = new Parse.Query(Task);
              query.include('requester');
              query.include('accepter');
              return query.get(task.id).then({
                success: function(result) {
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
  }
});
