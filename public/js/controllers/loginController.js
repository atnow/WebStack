angular
  .module('atnowApp')
  .controller('LoginController', function($scope, $log, $state, $rootScope){
    $scope.newUser= {
      email:"",
      password:"",
      fullName:"",
    };
    $scope.loginAlerts = [];
    $scope.registerAlerts = [];

    $scope.closeLoginAlert = function(index) {
      $scope.loginAlerts.splice(index, 1);
    };
    
    $scope.closeRegisterAlert = function(index) {
      $scope.registerAlerts.splice(index, 1);
    };

    $scope.register = function() {
      var Rating = Parse.Object.extend("Rating");
      var rating = new Rating();
      rating.set("rating", 0);
      rating.set("ratingCount", 0);
      rating.save();
      var user = new Parse.User();
      user.set("username", $scope.newUser.email);
      user.set("password", $scope.newUser.password);
      user.set("email", $scope.newUser.email);
      user.set("fullName", $scope.newUser.fullName);
      user.set("rating", rating);
      user.signUp(null, {
        success: function(user) {
          $rootScope.sessionUser=user;
          $state.go("app.feed");
        },
        error: function(user, error) {
          if($scope.registerAlerts.length > 2){
            $scope.splice(0, 1);
          }
          if(error.code === 202){
            $scope.registerAlerts.push({type: "danger", msg: "An account already exists with this email!"});
            $scope.$apply();
          }
          else{
            alert(error.message);
          }
        }
      });
    }

    $scope.login = function() {
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
    }
  });
