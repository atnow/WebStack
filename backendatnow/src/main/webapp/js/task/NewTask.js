'use strict';

atnowApp.controller('TaskFormCtrl', function ($scope, $http) {
  
  var newTask;
  newTask.title = '';
  newTask.description = '';
  newTask.price;
  newTask.expiration;
  
  newTask.commit = function() {
    gapi.client.atnow.tasks.insert({title: newTask.title, 
      description: newTask.description, 
      price: newTask.price}).execute();
  }
  
});