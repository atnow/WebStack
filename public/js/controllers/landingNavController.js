angular
  .module('atnowApp')
  .controller('LandingNavController', function($scope, $log, $state, $rootScope){
      $scope.loginShow = function(){
        $rootScope.$broadcast('login', 'a')
      };
  });