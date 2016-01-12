angular
  .module('atnowApp')
  .controller('UserDetailController', function($rootScope, $scope, $location, $log, User, $stateParams, 
  Task, userTasks, thisUser, todoTasks, pendingTasks, unclaimedTasks, awaitingConfirmationTasks){
  $scope.viewUser = thisUser;
  $scope.rating = thisUser.rating.get('rating');
  $scope.safeTasks= userTasks;

  //ERROR IF LOG OUT ON USER DETAIL PAGE
  $scope.isUser = function(){
    $log.log(thisUser);
    $log.log($rootScope.sessionUser);
    return thisUser.id === $rootScope.sessionUser.id;
  }

  $scope.current = {
    value: 'All'
  };

  if($scope.isUser()){
    $scope.current.value = 'To-do';
    $scope.safeTasks = todoTasks;
  }

  $scope.$watch(
    'current.value',
    function(newValue, oldValue) {
      if(newValue==='To-do'){
        $scope.safeTasks=todoTasks;
      }
      if(newValue==='Unclaimed'){
        $scope.safeTasks=unclaimedTasks;
      }
      if(newValue==='Pending'){
        $scope.safeTasks=pendingTasks;
      }
      if(newValue==='Awaiting Confirmation'){
        $scope.safeTasks=awaitingConfirmationTasks;
      }
      if(newValue==='All'){
        $scope.safeTasks=userTasks;
      }
    }
  );
});