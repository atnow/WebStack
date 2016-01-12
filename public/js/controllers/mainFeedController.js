angular.module('atnowApp').controller("MainFeedController", function($scope, $location, Task, allTasks, myNotifications, User) {
  $scope.safeTasks= allTasks;
  console.log(myNotifications);
});