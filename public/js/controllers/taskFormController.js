
angular.module('atnowApp').controller('TaskFormController', function ($scope, $http, $state, $rootScope) {
  
  $scope.newTask = {};
  $scope.newTask.title = '';
  $scope.newTask.description = '';
  $scope.newTask.location = '';
  $scope.newTask.price;
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  //calendar
  $scope.status ={
    opened: false
  };

  $scope.mytime = new Date();
  $scope.hstep = 1;
  $scope.mstep = 1;
  $scope.ismeridian = true;

  $scope.expiration = new Date();

  $scope.open = function(){
    $scope.status.opened = true;
  };
  
  $scope.commitTask = function() {
    //combine date and time
    $scope.expiration.setHours($scope.mytime.getHours());
    $scope.expiration.setMinutes($scope.mytime.getMinutes());
    $scope.expiration.setMilliseconds($scope.mytime.getMilliseconds());
    var Task = Parse.Object.extend("Task");
    var task = new Task();
    task.save({title: $scope.newTask.title, description: $scope.newTask.description, 
      price: $scope.newTask.price, expiration: $scope.expiration, 
      accepted: false, taskLocation: $scope.newTask.location,
      completed: false, requester: $rootScope.sessionUser, confirmed: false}).then(function(object) {
    });
    $state.go("app.feed");

  }
  
});