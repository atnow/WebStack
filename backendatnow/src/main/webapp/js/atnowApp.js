'use strict';

  var atnowApp = angular.module('atnowApp', ['ngRoute', 'smart-table', 'ngAnimate', 'ui.bootstrap'])

  .controller("TaskFeedController", function($scope) {


  gapi.client.atnow.tasks.list().execute(
      function(resp){
       $scope.$apply( function(){
       $scope.tasks=resp.items || [];
       $scope.tasks=[{price:5, title: "Get me hop", category: "food"}, {price: 10, title: "Quiz me on Latin", category:"homework"}];
      });
    });

})

.controller('TaskFormController', function ($scope, $http) {
  
  $scope.newTask = {};
  newTask.title = '';
  newTask.description = '';
  newTask.price;
  newTask.expiration;
  
  newTask.commit = function() {
    console.log("committing new task");
    gapi.client.atnow.tasks.insert({title: newTask.title, 
      description: newTask.description, 
      price: newTask.price}).execute();
  }
  
})

.controller('UserFormController', function ($scope, $http) {
  $scope.newUser = {};
  $scope.newUser.eduEmail = '';
  
  $scope.commit = function() {
    console.log('committing');
    gapi.client.atnow.users.insert({eduEmail: $scope.newUser.eduEmail}).execute(function(resp) {
      console.log(resp);
    });
    
    window.location = "/";
  }
  
})

.controller('NavBarController', function($scope, $http, $location) {
  var userAuthed = function() {
    var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
      if (!resp.code) {
        gapi.client.atnow.users.checkDetail().execute(
            function(resp) {
              if (Object.keys(resp).length <= 1) {
                console.log("no user detail in database redirecting to user detail page");
                console.log(resp);
                window.location = "#/newUser";
              } else {
                console.log("user detail in database");
                console.log(resp);
              }
            });
        atnow.index.signedIn = true;
        document.getElementById('signinButton').innerHTML = 'Sign out';
      }
    });
  };

  /**
   * Handles the auth flow, with the given value for immediate mode.
   * @param {boolean} mode Whether or not to use immediate mode.
   * @param {Function} callback Callback to call on completion.
   */
  var signin = function(mode, callback) {
    gapi.auth.authorize({client_id: atnow.index.CLIENT_ID,
        scope: atnow.index.SCOPES, immediate: mode},
        callback);
  };

  /**
   * Presents the user with the authorization popup.
   */
  var auth = function() {
    if (!atnow.index.signedIn) {
      atnow.index.signin(false,
          userAuthed);
    } else {
      atnow.index.signedIn = false;
      document.getElementById('signinButton').innerHTML = 'Sign in';
    }
  };
  
   signin(true, userAuthed);

})

  .config(['$routeProvider', '$provide', '$controllerProvider',

        function ($routeProvider, $provide, $controllerProvider) {

            //Change default views and controllers directory using the following:
            //routeResolverProvider.routeConfig.setBaseDirectories('/app/views', '/app/controllers');
         /*   atnowApp.register =
            {
                controller: $controllerProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };*/
            atnowApp.controller = $controllerProvider.register;

            $routeProvider
                //route.resolve() now accepts the convention to use (name of controller & view) as well as the 
                //path where the controller or view lives in the controllers or views folder if it's in a sub folder. 
                //For example, the controllers for customers live in controllers/customers and the views are in views/customers.
                //The controllers for orders live in controllers/orders and the views are in views/orders
                //The second parameter allows for putting related controllers/views into subfolders to better organize large projects
                //Thanks to Ton Yeung for the idea and contribution
                .when('/', {
                    controller: 'TaskFeedController',   
                    templateUrl: '/js/views/task/TaskFeed.html'
                    })
                .when('/newTask', {
                    controller: 'TaskFormController',
                    templateUrl: '/js/views/task/NewTask.html'
                })
                .when('/newUser', {
                    controller: 'UserFormController',
                    templateUrl: '/js/views/task/NewUser.html'
                })
                .otherwise({ redirectTo: '/'});

    }]);
