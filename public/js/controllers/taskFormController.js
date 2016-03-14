
angular.module('atnowApp').controller('TaskFormController', function ($scope, $http, $state, $rootScope, $uibModalInstance, TaskCode) {
  $scope.taskCode = TaskCode;

  var invalidForm = 'fail-input';

  $scope.invalidEntry = false;

  $scope.invalidTitle = false;
  $scope.invalidTitleClass = '';

  $scope.invalidPrice = false;
  $scope.invalidPriceClass = '';

  $scope.invalidTime = false;
  $scope.invalidTimeClass = '';


  //To save the new task must initalize fields of a javascript object
  $scope.newTask = {};
  $scope.newTask.title = '';
  $scope.newTask.description = '';
  $scope.newTask.location = '';
  $scope.newTask.price;
  $scope.newTask.requiresCar = false;
  $scope.newTask.requiresPurchase = false;
  $scope.newTask.requiresLifting = false;
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
    if ($scope.newTask.title === ''){
      $scope.invalidEntry = true;
      $scope.invalidTitle = true;
      $scope.invalidTitleClass = invalidForm;
    } else {
      $scope.invalidTitle = false;
      $scope.invalidTitleClass = '';
    }
    if (isNaN($scope.newTask.price) || $scope.newTask.price < 0) {
      $scope.invalidEntry = true;
      $scope.invalidPrice = true;
      $scope.invalidPriceClass = invalidForm;
    } else {
      $scope.invalidPrice = false;
      $scope.invalidPriceClass = '';
    }
    if ($scope.expiration <= new Date()) {
      $scope.invalidEntry = true;
      $scope.invalidTime = true;
      $scope.invalidTimeClass = invalidForm;
    } else {
      $scope.invalidTime = false;
      $scope.invalidTimeClass = '';
    }
    if ($scope.invalidEntry) {
      $scope.invalidEntry = false;
      return;
    }

    var Task = Parse.Object.extend("Task");
    var task = new Task();
    task.save({title: $scope.newTask.title, description: $scope.newTask.description, 
      price: $scope.newTask.price, expiration: $scope.expiration, 
      accepted: false, taskLocation: $scope.newTask.location,
      completed: false, requester: $rootScope.sessionUser, confirmed: false, 
      requiresCar: $scope.newTask.requiresCar, requiresPurchase: $scope.newTask.requiresPurchase, requiresLifting: $scope.newTask.requiresLifting}).then(function(object) {
    });
    $scope.taskCode.reload('feed');
    $uibModalInstance.dismiss('cancel');

  }

  $scope.carCheck = function() {
    $scope.newTask.requiresCar = !$scope.newTask.requiresCar;
  }

  $scope.purchaseCheck = function() {
    $scope.newTask.requiresPurchase = !$scope.newTask.requiresPurchase;
  }

  $scope.liftingCheck = function() {
    $scope.newTask.requiresLifting = !$scope.newTask.requiresLifting;
  }

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
  
});