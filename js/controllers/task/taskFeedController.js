'use strict';

 angular.module("atnowApp").controller("TaskFeedController", taskFeed);

 var taskFeed =  function($scope) {

 console.log("suck it");


  gapi.client.atnow.tasks.list().execute(
      function(resp){
       $scope.$apply( function(){
       $scope.tasks=resp.items || [];
      });
    });

  TaskFeedController.$inject = injectParams;
  atnowApp.register.controller("TaskFeedController", TaskFeedController);
}