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
                    templateUrl: '/js/views/task/taskFeed.html'
                    })
                .otherwise({ redirectTo: '/'});

    }]);
