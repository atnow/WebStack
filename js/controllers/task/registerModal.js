atnowApp.controller('registerModalController', function($scope, $uibModalInstance, $log){
  $scope.newUser= {
    email:"",
    password:"",
    phone:""
  };
  $scope.register = function() {
    var user = new Parse.User();
    user.set("username", $scope.newUser.email);
    user.set("password", $scope.newUser.password);
    user.set("email", $scope.newUser.email);
    user.set("phone", $scope.newUser.phone);
    user.signUp(null, {
      success: function(user) {
        $log.log("why?");
      },
      error: function(user, error) {
        alert("Error" + error.code + " " + error.message);
      }
    });
    $uibModalInstance.close();
  }
});

atnowApp.controller('NavBarController', function($scope, $state, $rootScope, $log, $location) {
  /*$scope.register = function(){
    var modalInstance = $uibModal.open({
      templateUrl: "/js/views/user/registerModal.html",
      controller: "registerModalController",
      size:"lg"
    });

    modalInstance.result.then(function (){

    });
  }*/
});