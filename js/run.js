angular.module('atnowApp').run(function($rootScope, $state, $log, $location, User) {
  $rootScope.sessionUser = User.current();
 // Listen for state changes when using ui-router
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    //no need to redirect
    if(toState.name === "login"){
      if($rootScope.sessionUser){
        event.preventDefault();
        $state.go("app.feed");
      }
      return;
    }
    if($rootScope.sessionUser){
      return;
    }
    event.preventDefault();
    $state.go("login");
  });
});