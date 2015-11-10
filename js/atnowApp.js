'use strict';
var atnowApp = angular.module('atnowApp', ["ui.router", "ui.bootstrap", "smart-table", "ngAnimate"]);

atnowApp.controller("TaskFeedController", function($scope, $location, Task, parseTasks) {
  $scope.safeTasks= parseTasks;
  $scope.displayedTasks=[].concat($scope.safeTasks);
  $scope.itemsByPage=5;
  $scope.newTask = function() {
    $location.path("/newTask");
  }
});

atnowApp.controller('TaskFormController', function ($scope, $http, $location) {
  
  $scope.newTask = {};
  $scope.newTask.title = '';
  $scope.newTask.description = '';
  $scope.newTask.price;
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.status ={
    opened: false
  };

  $scope.mytime = new Date();
  $scope.hstep = 1;
  $scope.mstep = 1;
  $scope.ismeridian = true;

  $scope.expiration = new Date();

  $scope.open = function(){
    $scope.status.opened = true;
  };
  
  $scope.commitTask = function() {
    //combine date and time
    $scope.expiration.setHours($scope.mytime.getHours());
    $scope.expiration.setMinutes($scope.mytime.getMinutes());
    $scope.expiration.setMilliseconds($scope.mytime.getMilliseconds());
    var Task = Parse.Object.extend("Task");
    var task = new Task();
    task.save({title: $scope.newTask.title, description: $scope.newTask.description, 
      price: $scope.newTask.price, expiration: $scope.expiration}).then(function(object) {
    });
    $location.path("/");
  }
  
});

atnowApp.controller("TaskController", function($scope, $routeParams, $location) {

  gapi.client.atnow.tasks.get({id:$routeParams.taskId}).execute(
      function(resp){
       $scope.$apply( function(){
       console.log(resp);
       $scope.taskpage=resp || {};
      });
    });

  $scope.claimTask = function() {
  }
});

atnowApp.controller('UserDetailController', function($rootScope, $scope, $location){

});

atnowApp.controller('UserFormController', function ($scope, $http, $location) {
  $scope.newUser = {};
  $scope.newUser.eduEmail = '';
  $scope.newUser.phoneNumber = '';
  $scope.newUser.contactMethod = '';
  
  $scope.commitUser = function() {
    console.log('committing');
    $location.path("/");
  }
  
});

atnowApp.controller('NavBarController', function($scope, $uibModal, $location) {
  $scope.register = function(){
    var modalInstance = $uibModal.open({
      templateUrl: "/js/views/user/registerModal.html",
      controller: "registerModalController",
      size:"lg"
    });

    modalInstance.result.then(function (){

    });
  }
});

atnowApp.controller('registerModalController', function($scope, $uibModalInstance, $log){
  $scope.newUser= {
    email:"",
    password:"",
    phone:""
  };
  $scope.register = function() {
    var user = new Parse.User();
    user.set("username", $scope.newUser.email);
    user.set("password", $scope.newUser.password);
    user.set("email", $scope.newUser.email);
    user.set("phone", $scope.newUser.phone);
    user.signUp(null, {
      success: function(user) {
        $log.log("why?");
      },
      error: function(user, error) {
        alert("Error" + error.code + " " + error.message);
      }
    });
    $uibModalInstance.close();
  }
});

atnowApp.config(

        function ($stateProvider, $urlRouterProvider, $provide, $controllerProvider) {

            atnowApp.controller = $controllerProvider.register;

            $urlRouterProvider.otherwise("feed");
            $stateProvider
                .state('feed', {
                    url: "/feed",
                    controller: 'TaskFeedController',   
                    templateUrl: '/js/views/task/TaskFeed.html',
                    resolve:{
                      parseTasks: function(Task){
                        var query = new Parse.Query(Task);
                        return query.find().then(
                          function(results) {
                            console.log(results);
                            return results;
                          },
                          function(error) {
                            alert("Error: " + error.code + " " + error.message);
                            return error;
                        });
                      }
                    }
                })
                .state('newTask', {
                    url: "/newTask",
                    controller: 'TaskFormController',
                    templateUrl: '/js/views/task/NewTask.html'
                })
                .state('newUser', {
                    url: "/newUser",
                    controller: 'UserFormController',
                    templateUrl: '/js/views/user/NewUser.html'
                })
                .state('dashboard', {
                    url: "/dashboard",
                    controller: 'UserDetailController',
                    templateUrl: '/js/views/user/UserDetail.html'
                })
                .state('/task/:taskId', {
                    url: "/task/:taskId",
                    controller: 'TaskController',
                    templateUrl: '/js/views/task/TaskPage.html'
                });

    });

atnowApp.run(function($rootScope) {
  $rootScope.sessionUser = Parse.User.current();
});

atnowApp.factory("User", function(){
  var User = Parse.Object.extend("User");
  Object.defineProperty(User.prototype, "name", {
    get: function() {
      return this.get("fullName");
    },
    set: function(val) {
      this.set(name, val);
    }
  });
  Object.defineProperty(User.prototype, "email", {
    get: function() {
      return this.get("email");
    },
    set: function(val) {
      this.set(email, val);
    }
  });
  Object.defineProperty(User.prototype, "phone", {
    get: function() {
      return this.get("phone");
    },
    set: function(val) {
      this.set(phone, val);
    }
  });
  Object.defineProperty(User.prototype, "rating", {
    get: function() {
      return this.get("rating");
    },
    set: function(val) {
      this.set(rating, val);
    }
  });
  Object.defineProperty(User.prototype, "ratingCount", {
    get: function() {
      return this.get("ratingCount");
    },
    set: function(val) {
      this.set(ratingCount, val);
    }
  });
  Object.defineProperty(User.prototype, "tasksClaimed", {
    get: function() {
      return this.get("tasksClaimed");
    },
    set: function(val) {
      this.set(tasksClaimed, val);
    }
  });
  Object.defineProperty(User.prototype, "tasksRequested", {
    get: function() {
      return this.get("tasksRequested");
    },
    set: function(val) {
      this.set(tasksRequested, val);
    }
  });
});

atnowApp.factory("Task", function(){
  var Task = Parse.Object.extend("Task");
  Object.defineProperty(Task.prototype, "title", {
      get: function() {
        return this.get("title");
      },
      set: function(val) {
        this.set(title, val);
      }
  });
  Object.defineProperty(Task.prototype, "description", {
      get: function() {
        return this.get("description");
      },
      set: function(val) {
        this.set(description, val);
      }
  });
  Object.defineProperty(Task.prototype, "price", {
      get: function() {
        return this.get("price");
      },
      set: function(val) {
        this.set(price, val);
      }
  });
  Object.defineProperty(Task.prototype, "expiration", {
      get: function() {
        return this.get("expiration");
      },
      set: function(val) {
        this.set(expiration, val);
      }
  });
  Object.defineProperty(Task.prototype, "category", {
    get: function() {
      return this.get("category");
    },
    set: function(val) {
      this.set(category, val);
    }
  });
  return Task;
})