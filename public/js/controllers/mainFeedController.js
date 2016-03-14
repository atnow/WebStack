angular.module('atnowApp').controller("MainFeedController", function($rootScope, $scope, $location, $window, Task, allTasks, myNotifications, User, TaskCode) {
  $scope.taskCode = TaskCode;
  var QueryString = function () {
    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split('=');
          // If first entry with this name
      if (typeof query_string[pair[0]] === 'undefined') {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
          // If second entry with this name
      } else if (typeof query_string[pair[0]] === 'string') {
        var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
        query_string[pair[0]] = arr;
          // If third or later entry with this name
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    } 
      return query_string;
  }();
  console.log($rootScope.sessionUser);
  if (QueryString.code !== undefined){
    Parse.Cloud.run('getAccessToken', {code : QueryString.code}
      ).then(function(accessToken){
        Parse.User.current().fetch({
          success: function(updatedUser){
            $rootScope.sessionUser = updatedUser;
            console.log($rootScope.sessionUser);
            $window.location.href = '/#/login';
          },
          error: function(updatedUser, error){
            console.log(error);
          }
        });
      });
  }
  
  $scope.newTask = function() {
    $scope.taskCode.newTask($rootScope.sessionUser);
  }


  $scope.safeTasks= allTasks;
});