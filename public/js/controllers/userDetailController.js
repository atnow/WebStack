angular
  .module('atnowApp')
  .controller('UserDetailController', function($rootScope, $scope, $location, $log, User, $stateParams,
  Task, accepterTasks, requesterTasks, thisUser, TaskCode){
  $scope.taskCode = TaskCode;
  $scope.viewUser = thisUser;
  $scope.rating = thisUser.rating.get('rating');
  $scope.safeTasks= accepterTasks;


  $scope.claimedBool = true;
  $scope.typeOfTasks = "claimed";
  $scope.claimed = function(){
    $scope.typeOfTasks = "claimed";
    $scope.claimedBool = true;
    $scope.current.value = 'To-do';
    $scope.todoClass = 'btn-warning active';
    $scope.claimedAwaitingClass = 'btn-default';
    $scope.claimedComplete = 'btn-default';
  }
  $scope.requested = function(){
    $scope.typeOfTasks = "requested";
    $scope.claimedBool = false;
    $scope.current.value = 'Unclaimed';
    $scope.unclaimedClass = 'unclaimed active';
    $scope.inProgClass = 'btn-default';
    $scope.requestedAwaitingClass = 'btn-default';
    $scope.requestedCompleteClass = 'btn-default';
  }
  //ERROR IF LOG OUT ON USER DETAIL PAGE
  $scope.isUser = function(){
    return thisUser.id === $rootScope.sessionUser.id;
  }

  $scope.newTask = function() {
    $scope.taskCode.newTask($rootScope.sessionUser);
  }

  /*
  To-do
  Awaiting confirmation
  complete

  unclaimed
  in progress
  awaiting confirmation
  complete
  */

  $scope.current = {
    value: 'All'
  };


  unclaimedFilter = function(task){
    return task.accepted === false;
  };

  inProgressFilter = function(task){
    return task.completed === false && task.accepted === true;
  };

  completeFilter = function(task){
    return task.completed === true && task.confirmed===true;
  };

  awaitingFilter = function(task){
    return task.completed === true && task.confirmed===false;
  };

  accepterTodoTasks = function(){
    $scope.safeTasks = accepterTasks.filter(inProgressFilter);
    $scope.todoClass = 'btn-warning';
    $scope.claimedAwaitingClass = 'btn-default';
    $scope.claimedComplete = 'btn-default';
  };

  accepterAwaitingTasks = function(){
    $scope.safeTasks = accepterTasks.filter(awaitingFilter);
    $scope.todoClass = 'btn-default';
    $scope.claimedAwaitingClass = 'btn-primary';
    $scope.claimedComplete = 'btn-default';
  };

  accepterCompleteTasks = function(){
    $scope.safeTasks = accepterTasks.filter(completeFilter);
    $scope.todoClass = 'btn-default';
    $scope.claimedAwaitingClass = 'btn-default';
    $scope.claimedComplete = 'btn-success';
  };

  requesterUnclaimedTasks = function(){
    $scope.safeTasks = requesterTasks.filter(unclaimedFilter);
    $scope.unclaimedClass = 'unclaimed active';
    $scope.inProgClass = 'btn-default';
    $scope.requestedAwaitingClass = 'btn-default';
    $scope.requestedCompleteClass = 'btn-default';
  };

  requesterInProgressTasks = function(){
    $scope.safeTasks = requesterTasks.filter(inProgressFilter);
    $scope.unclaimedClass = 'btn-default';
    $scope.inProgClass = 'btn-warning';
    $scope.requestedAwaitingClass = 'btn-default';
    $scope.requestedCompleteClass = 'btn-default';
  };

  requesterAwaitingTasks = function(){
    $scope.safeTasks = requesterTasks.filter(awaitingFilter);
    $scope.unclaimedClass = 'btn-default';
    $scope.inProgClass = 'btn-default';
    $scope.requestedAwaitingClass = 'btn-primary';
    $scope.requestedCompleteClass = 'btn-default';
  };

  requesterCompleteTasks = function(){
    $scope.safeTasks = requesterTasks.filter(completeFilter);
    $scope.unclaimedClass = 'btn-default';
    $scope.inProgClass = 'btn-default';
    $scope.requestedAwaitingClass = 'btn-default';
    $scope.requestedCompleteClass = 'btn-success';
  };







  if($scope.isUser()){
    $scope.current.value = 'To-do';
    accepterTodoTasks();
  }



  $scope.$watch(
    'current.value',
    function(newValue, oldValue) {
      if(newValue==='To-do'){
        accepterTodoTasks();
      }
      if(newValue==='claimedAwaiting'){
        accepterAwaitingTasks();
      }
      if(newValue==='claimedComplete'){
        accepterCompleteTasks();
      }
      if(newValue==='Unclaimed'){
        requesterUnclaimedTasks();
      }
      if(newValue==='In Progress'){
        requesterInProgressTasks();
      }
      if(newValue==='requestedAwaiting'){
        requesterAwaitingTasks();
      }
      if(newValue==='requestedComplete'){
        requesterCompleteTasks();
      }
      console.log($scope.safeTasks);
      console.log($scope.safeTasks.length);
    }
  );


});
