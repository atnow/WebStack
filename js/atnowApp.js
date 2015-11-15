'use strict';
var atnowApp = angular.module('atnowApp', ["ui.router", "ui.bootstrap", "smart-table", "ngAnimate"]);

atnowApp.controller("MainFeedController", function($scope, $location, Task, allTasks) {
  $scope.safeTasks= allTasks;
});

atnowApp.controller("TaskTableController", function($scope, Task){
  $scope.displayedTasks=[].concat($scope.safeTasks);
  $scope.itemsByPage=5;

  $scope.emptyTasks = function(){
    return $scope.safeTasks.length === 0;
  }

});

atnowApp.controller('TaskFormController', function ($scope, $http, $state, $rootScope) {
  
  $scope.newTask = {};
  $scope.newTask.title = '';
  $scope.newTask.description = '';
  $scope.newTask.location = '';
  $scope.newTask.price;
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  //calendar
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
      price: $scope.newTask.price, expiration: $scope.expiration, 
      accepted: false, taskLocation: $scope.newTask.location,
      completed: false, requester: $rootScope.sessionUser}).then(function(object) {
    });
    $state.go("feed");

  }
  
});

atnowApp.controller("TaskController", function($scope, $stateParams, $rootScope, $state, Task, taskDetail) {

  $scope.task = taskDetail;
  $scope.completer = false;
  if (taskDetail.accepted === true && (typeof taskDetail.accepter !== 'undefined' && taskDetail.accepter !== null) 
    && taskDetail.accepter.get('id') === $rootScope.sessionUser.get('id')) {
    $scope.completer = true;
  }

  $scope.isRequester = false;

  if ((typeof taskDetail.requester !== 'undefined' && taskDetail.requester !== null) 
    && taskDetail.requester.get('id') === $rootScope.sessionUser.get('id')) {
    $scope.isRequester = true;
  }

  $scope.completeTask = function(){
    $scope.task.set("completed", true);
    $scope.task.save();
  }

  $scope.relinquishTask = function(){
    $scope.task.set("accepter", null);
    $scope.task.set("accepted", false);
    $scope.task.save();
    $state.go("feed");
  }
  
  $scope.claimTask = function(){
    $scope.task.set("accepter", $rootScope.sessionUser);
    $scope.task.set("accepted", true);
    $scope.task.save();
  };
});

atnowApp.controller('UserDetailController', function($rootScope, $scope, $location, $log, User, $stateParams, Task, userTasks, thisUser, todoTasks, pendingTasks){
  $scope.viewUser = thisUser;
  $scope.safeTasks= userTasks;
  
  $scope.isUser = function(){
    return thisUser.id === $rootScope.sessionUser.id;
  }

  $scope.current = {
    value: 'All'
  };

  if($scope.isUser()){
    $log.log("To-do");
    $scope.current.value = 'To-do';
    $scope.safeTasks = todoTasks;
  }

  $scope.$watch(
    'current.value',
    function(newValue, oldValue) {
      if(newValue==='All'){
        $scope.safeTasks=userTasks;
      }
      if(newValue==='To-do'){
        $scope.safeTasks=todoTasks;
      }
      if(newValue==='Pending'){
        $scope.safeTasks=pendingTasks;
      }
    }
  );
});


atnowApp.controller('NavBarController', function($scope, $state, $rootScope, $log, $location) {
  $scope.signOut = function(){
    Parse.User.logOut();
    $rootScope.sessionUser=Parse.User.current();
    $location.url("/login");
  }
});


atnowApp.controller('LoginController', function($scope, $log, $state, $rootScope){
  $scope.newUser= {
    email:"",
    password:"",
    phone:"",
    fullName:""
  };
  $scope.loginAlerts = [];
  $scope.registerAlerts = [];

  $scope.closeLoginAlert = function(index) {
    $scope.loginAlerts.splice(index, 1);
  };
  
  $scope.closeRegisterAlert = function(index) {
    $scope.registerAlerts.splice(index, 1);
  };

  $scope.register = function() {
    var user = new Parse.User();
    user.set("username", $scope.newUser.email);
    user.set("password", $scope.newUser.password);
    user.set("email", $scope.newUser.email);
    user.set("phone", $scope.newUser.phone);
    user.set("fullName", $scope.newUser.fullName);
    user.signUp(null, {
      success: function(user) {
        $rootScope.sessionUser=user;
        $state.go("feed");
      },
      error: function(user, error) {
        if($scope.registerAlerts.length > 2){
          $scope.splice(0, 1);
        }
        if(error.code === 202){
          $scope.registerAlerts.push({type: "danger", msg: "An account already exists with this email!"});
          $scope.$apply();
        }
        else{
          alert(error.message);
        }
      }
    });
  }

  $scope.login = function() {
    Parse.User.logIn($scope.loginUser.email, $scope.loginUser.password, {
      success: function(user) {
        // Do stuff after successful login.
        $rootScope.sessionUser=user;
        $state.go("feed");
      },
      error: function(user, error) {
        // The login failed. Check error to see why.
        if($scope.loginAlerts.length > 2){
          $scope.splice(0, 1);
        }
        if(error.code===101){
        $scope.loginAlerts.push({type: "danger", msg: 'Incorrect email/password combo, try again!'});
        $scope.$apply();
        }
      }
    });
  }
});

atnowApp.config(

        function ($stateProvider, $urlRouterProvider, $provide, $controllerProvider) {

            atnowApp.controller = $controllerProvider.register;

            $urlRouterProvider.otherwise(function($injector){
              var $state = $injector.get("$state");
              $state.go("feed");
            });
            $stateProvider
                .state('feed', {
                    url: "/feed",
                    controller: 'MainFeedController',   
                    templateUrl: '/js/views/task/MainFeed.html',
                    resolve:{
                      allTasks: function(Task){
                        var query = new Parse.Query(Task);
                        query.equalTo("accepted", false);
                        query.equalTo("completed", false);
                        query.greaterThan("expiration", new Date());
                        return query.find().then(
                          function(results) {
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
                    url: "/dashboard/:userId",
                    controller: 'UserDetailController',
                    templateUrl: '/js/views/user/UserDetail.html',
                    resolve:{
                      userTasks: function(Task, User, $stateParams){
                        var query = new Parse.Query(User);
                        return query.get($stateParams.userId).then(
                          function(result){
                            var accepterQuery = new Parse.Query(Task);
                            accepterQuery.equalTo("accepter", result);
                            var requesterQuery = new Parse.Query(Task);
                            requesterQuery.equalTo("requester", result);
                            var mainQuery = Parse.Query.or(accepterQuery, requesterQuery);
                            return mainQuery.find().then(
                              function(results) {
                                return results;
                              },
                              function(error) {
                                alert("Error: " + error.code + " " + error.message);
                                return error;
                              }); 
                          },
                          function(error){
                            console.log(error.message);
                          }
                        );
                      },
                      thisUser: function(User, $stateParams){
                        var query = new Parse.Query(User);
                        return query.get($stateParams.userId).then(
                          function(result){
                            return result;
                          },
                          function(error){
                            return error;
                          });
                      },
                      todoTasks: function(Task, User, $stateParams){
                        var query = new Parse.Query(User);
                        return query.get($stateParams.userId).then(
                          function(result){
                            var accepterQuery = new Parse.Query(Task);
                            accepterQuery.equalTo("completed", false);
                            accepterQuery.equalTo("accepter", result);
                            return accepterQuery.find().then(
                              function(results) {
                                return results;
                              },
                              function(error) {
                                alert("Error: " + error.code + " " + error.message);
                                return error;
                              }); 
                          },
                          function(error){
                            console.log(error.message);
                          }
                        );
                      },
                      pendingTasks: function(Task, User, $stateParams){
                        var query = new Parse.Query(User);
                        return query.get($stateParams.userId).then(
                          function(result){
                            var accepterQuery = new Parse.Query(Task);
                            accepterQuery.equalTo("confirmed", false);
                            accepterQuery.equalTo("requester", result);
                            return accepterQuery.find().then(
                              function(results) {
                                return results;
                              },
                              function(error) {
                                alert("Error: " + error.code + " " + error.message);
                                return error;
                              }); 
                          },
                          function(error){
                            console.log(error.message);
                          }
                        );
                      }
                    }
                })
                .state('taskDetail', {
                    url: "/task/:taskId",
                    controller: 'TaskController',
                    templateUrl: '/js/views/task/TaskPage.html',
                    resolve:{
                      taskDetail:function(Task, $stateParams) {
                        var query = new Parse.Query(Task);
                        return query.get($stateParams.taskId).then({
                          success: function(result) {
                            console.log(result);
                            return result;
                          },
                          error: function(error) {
                            alert("Error: " + error.code + " " + error.message);
                            return error;
                          }
                        });
                      }
                    }
                })
                .state('login', {
                    url: "/login",
                    controller: "LoginController",
                    templateUrl: "/js/views/user/Login.html"
                });


    });

atnowApp.run(function($rootScope, $state, $log, $location, User) {
  $rootScope.sessionUser = User.current();
 // Listen for state changes when using ui-router
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    $log.log(toState.name + " " + $rootScope.sessionUser);
    //no need to redirect
    if(toState.name === "login"){
      if($rootScope.sessionUser){
        event.preventDefault();
        $state.go("feed");
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

atnowApp.factory("User", function(){
  var User = Parse.User.extend("User");
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
  return User;
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
  Object.defineProperty(Task.prototype, "accepter", {
      get: function() {
        return this.get("accepter");
      },
      set: function(val) {
        this.set(title, val);
      }
  });
  Object.defineProperty(Task.prototype, "accepted", {
      get: function() {
        return this.get("accepted");
      },
      set: function(val) {
        this.set(title, val);
      }
  });
  Object.defineProperty(Task.prototype, "completed", {
      get: function() {
        return this.get("completed");
      },
      set: function(val) {
        this.set(title, val);
      }
  });
  Object.defineProperty(Task.prototype, "location", {
      get: function() {
        return this.get("taskLocation");
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
});
