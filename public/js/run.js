angular.module('atnowApp').run(function($rootScope, $state, $log, $location, $window, User) {
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
    $log.log($rootScope.sessionUser);
    if($rootScope.sessionUser && ($rootScope.sessionUser.venmoAccessToken === undefined || $rootScope.sessionUser.venmoAccessToken === null) && toState.name !== "app.auth") {
      $window.location.href="https://api.venmo.com/v1/oauth/authorize?client_id=3411&scope=make_payments%20access_profile%20access_email%20access_phone%20access_balance&response_type=code";
      return;
    }
    if($rootScope.sessionUser){
      return;
    }
    event.preventDefault();
    $state.go("login");
  });
});