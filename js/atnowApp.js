define(function (require){
'use strict';
var angular = require("angular");

var atnowApp = angular.module('atnowApp', [])

.controller("TaskFeedController", function($scope, $location) {

  $scope.safeTasks={};
  $scope.displayedTasks=[].concat($scope.safeTasks);
  $scope.itemsByPage=2;
  $scope.newTask = function() {
    $location.path("/newTask");
  }
})

.controller('TaskFormController', function ($scope, $http, $location) {
  
  $scope.newTask = {};
  $scope.newTask.title = '';
  $scope.newTask.description = '';
  $scope.newTask.price;
  $scope.newTask.expiration;
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.status ={
    opened: false
  };

  $scope.mytime = new Date();
  $scope.hstep = 1;
  $scope.mstep = 1;
  $scope.ismeridian = true;

  $scope.mydate = new Date();

  $scope.open = function(){
    $scope.status.opened = true;
  };
  
  $scope.commitTask = function() {
    //combine date and time
    $scope.mydate.setHours($scope.mytime.getHours());
    $scope.mydate.setMinutes($scope.mytime.getMinutes());
    $scope.mydate.setMilliseconds($scope.mytime.getMilliseconds());
    $location.path("/");
  }
  
})

.controller("TaskController", function($scope, $routeParams, $location) {

  gapi.client.atnow.tasks.get({id:$routeParams.taskId}).execute(
      function(resp){
       $scope.$apply( function(){
       console.log(resp);
       $scope.taskpage=resp || {};
      });
    });

  $scope.claimTask = function() {
  }
})

.controller('UserDetailController', function($scope, $location){
})

.controller('UserFormController', function ($scope, $http, $location) {
  $scope.newUser = {};
  $scope.newUser.eduEmail = '';
  $scope.newUser.phoneNumber = '';
  $scope.newUser.contactMethod = '';
  
  $scope.commitUser = function() {
    console.log('committing');
    $location.path("/");
  }
  
})

.controller('NavBarController', function($scope, $http, $location) {

})

  .config(['$provide', '$controllerProvider', '$routeProvider',

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
                    templateUrl: '/js/views/user/NewUser.html'
                })
                .when('/myUser', {
                    controller: 'UserDetailController',
                    templateUrl: '/js/views/user/UserDetail.html'
                })
                .when('/task/:taskId', {
                    controller: 'TaskController',
                    templateUrl: '/js/views/task/TaskPage.html'
                })
                .otherwise({ redirectTo: '/'});

    }]);

  atnowApp.init = function() {
    angular.bootstrap(document, ["atnowApp"])
  };
  
  return atnowApp;
});
