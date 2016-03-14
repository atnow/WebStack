angular
  .module('atnowApp')
  .controller('LandingController', function($scope, $log, $state, $rootScope){
      $scope.login = false;
      $scope.$on('login', function(response){
        $scope.login= !$scope.login;
      });

      $scope.newUser= {
      email:"",
      password:"",
      fullName:"",
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
      $scope.logIn = function() {
      Parse.User.logIn($scope.loginUser.email, $scope.loginUser.password, {
        success: function(user) {
          $rootScope.sessionUser=user;
          if(!user.get('emailVerified')){
            $state.go('app.verifyEmail');
          }
          else{
            $state.go("app.feed");
          }
        },
        error: function(user, error) {
          // The login failed. Check error to see why.
          if(error.code===101){
            alert("Incorrect login/password");
          }
        }
      });
    }
  });