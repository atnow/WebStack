angular.module('atnowApp').controller('NavBarController', function($scope, $state, $rootScope, $log, $location, myNotifications) {
  $scope.signOut = function(){
    Parse.User.logOut();
    $rootScope.sessionUser=Parse.User.current();
    $location.url("/login");
  }

  $scope.userNotifications = myNotifications;
  
  $scope.noNotifications = function(){
    return myNotifications && myNotifications.length===0;
  }
});