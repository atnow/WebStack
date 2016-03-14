describe('TaskFormController', function() {
  beforeEach(module('atnowApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

  beforeEach(function(){
    Parse.initialize("0oeGyi6DM6AwliCkDTBxr14OLcrgV3MYx1Gc4wHK", "Lba978MC6EMU6g7msUvLiUHza8vjkqGVf1Qq1eSo"); 
  });

  describe('$scope.commitTask', function() {
    it('commits a task', function() {
      var $scope = {};
      var controller = $controller('TaskFormController', { $scope: $scope });
      Parse.User.logIn($scope.loginUser.email, $scope.loginUser.password, {
        success: function(user) {
          // Do stuff after successful login.
          $rootScope.sessionUser=user;
          $state.go("app.feed");
        },
        error: function(user, error) {
          // The login failed. Check error to see why.
          if($scope.loginAlerts.length > 2){
            $scope.splice(0, 1);
          }
          if(error.code===101){
          $scope.loginAlerts.push({type: "danger", msg: 'Incorrect email/password combo, try again!'});
          $scope.$apply();
          }
        }
      });
    $scope.newTask = {};
    $scope.newTask.title = 'test task';
    $scope.newTask.description = 'this is a test';
    $scope.newTask.location = 'Novack';
    $scope.newTask.price = 10;
    $scope.expiration.setHours($scope.mytime.getHours());
    $scope.expiration.setMinutes($scope.mytime.getMinutes());
    $scope.expiration.setMilliseconds($scope.mytime.getMilliseconds());
    $scope.commitTask();
    expect(Parse.Query($scope.newTask.title)).toEqual(!null);
    });
  });
});

