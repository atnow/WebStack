angular
  .module('atnowApp')
  .controller('UserEditFormController', function($rootScope, $scope, $log, $state, thisUser, TaskCode){
  $scope.taskCode = TaskCode;
  $scope.editUser= {
    phone:thisUser.phone,
    fullName:thisUser.name
  };
  $scope.thisUser = thisUser;
  $scope.profPic = {};

  $scope.confirmEdit = function(){
    var parseFile;
    var fileUploadControl = $("#profilePicture")[0];
    if (fileUploadControl.files.length > 0) {
      var file = fileUploadControl.files[0];
      var name = "profPic.png";

      parseFile = new Parse.File(name, file);
      parseFile.save().then(function(){
        thisUser.set("profilePicture", parseFile);
        thisUser.save();
      },
      function(error){
        alert("Error: " + error.code + " " + error.message);
        return error;
      });
    }
    if ($scope.editUser.fullName !== thisUser.name) {
      thisUser.set("fullName", $scope.editUser.fullName);
    }
    thisUser.save();
    $scope.taskCode.reload('feed');
  };

});