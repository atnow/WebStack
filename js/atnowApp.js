'use strict';
var atnowApp = angular.module('atnowApp', ["ui.router", "ui.bootstrap", "smart-table", "ngAnimate"]);

atnowApp.controller("MainFeedController", function($scope, $location, Task, allTasks, myNotifications, User) {
  $scope.safeTasks= allTasks;
  console.log(myNotifications);
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
      completed: false, requester: $rootScope.sessionUser, confirmed: false}).then(function(object) {
    });
    $state.go("app.feed");

  }
  
});


atnowApp.controller("TaskController", function($log, $scope, $stateParams, $rootScope, $state, $uibModal, Task, taskDetail, User) {
  $scope.task = taskDetail;
  $scope.isCompleter = false;
  if (taskDetail.accepted && (typeof taskDetail.accepter !== 'undefined' && taskDetail.accepter !== null) 
    && taskDetail.accepter.id === $rootScope.sessionUser.id) {
    $scope.isCompleter = true;
  }

  $scope.isRequester = false;
  if (taskDetail.requester.id === $rootScope.sessionUser.id) {
    $scope.isRequester = true;
  }

  $scope.taskStatus = '';
  if (!$scope.task.accepted) {
    $scope.taskStatus = 'Unclaimed';
  } else if ($scope.task.accepted && !$scope.task.completed) {
    $scope.taskStatus = 'In Progress';
  } else if ($scope.task.completed && !$scope.task.confirmed) {
    $scope.taskStatus = 'Awaiting Confirmation';
  } else if ($scope.task.confirmed) {
    $scope.taskStatus = 'Complete';
  }

  $scope.completeTask = function(){

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/js/views/task/TaskRating.html',
      controller: 'TaskModalController',
      size: 'sm',
      resolve: {
        reviewUser: function (User) {
          var query = new Parse.Query(User);
          query.include('rating');
          return query.get($scope.task.requester.id).then({
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
    });

    modalInstance.result.then(function () {
      $scope.task.set("completed", true);
      var Notification = Parse.Object.extend("Notification");
      var notification = new Notification();
      notification.save({type:"completed", task: $scope.task, isRead: false, owner: $scope.task.get("requester")});   
      $scope.task.save();
    });
  }

  $scope.relinquishTask = function(){
    $scope.task.set("accepter", null);
    $scope.task.set("accepted", false);
    $scope.task.save();
    $state.go("app.feed");
  }
  
  $scope.claimTask = function(){
    $scope.task.set("accepter", $rootScope.sessionUser);
    $scope.task.set("accepted", true); 
    var Notification = Parse.Object.extend("Notification");
    var notification = new Notification();
    notification.save({type:"claimed", task: $scope.task, isRead: false, owner: $scope.task.get("requester")});    
    $scope.task.save();
    $state.go('app.dashboard', {'userId': $rootScope.sessionUser.id});
  };

  $scope.confirmTask = function(){
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/js/views/task/TaskRating.html',
      controller: 'TaskModalController',
      size: 'sm',
      resolve: {
        reviewUser: function (User) {
          var query = new Parse.Query(User);
          query.include('rating');
          return query.get($scope.task.accepter.id).then({
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
    });

    modalInstance.result.then(function () {
      var Notification = Parse.Object.extend("Notification");
      var notification = new Notification();
      notification.save({type:"confirmed", task: $scope.task, isRead: false, owner: $scope.task.accepter});
      $scope.task.set("confirmed", true);
      $scope.task.save();
      $state.go('app.dashboard', {'userId': $rootScope.sessionUser.id});
    });
  };

  $scope.reportUser = function() {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/js/views/task/Report.html',
      controller: 'TaskModalController',
      resolve: {
        reviewUser: function (User) {
          var query = new Parse.Query(User);
          return query.get($scope.task.accepter.id).then({
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
    });

    modalInstance.result.then(function () {
      $scope.task.set("accepter", null);
      $scope.task.set("accepted", false);
      $scope.task.set("completed", false);
      $scope.task.save();
    });
  };

});

atnowApp.controller('TaskModalController', function ($scope, $uibModalInstance, $rootScope, reviewUser){
  $scope.reportInformation = "";
  $scope.username = reviewUser.get('fullName');
  $scope.rate = 5;
  $scope.max = 5;
  $scope.isReadonly = false;

  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.ratingType = '';
    if (value === 1) {
      $scope.ratingType = 'Horrible';
    } else if (value === 2) {
      $scope.ratingType = 'Bad';
    } else if (value === 3) {
      $scope.ratingType = 'OK';
    } else if (value === 4) {
      $scope.ratingType = 'Good';
    } else if (value === 5) {
      $scope.ratingType = 'Great';
    }
  };

  $scope.report = function() {
    var Report = Parse.Object.extend("Report");
    var report = new Report();
    report.save({offender: reviewUser, detail: $scope.reportInformation, reporter:$rootScope.sessionUser, dealtWith: false});
    $uibModalInstance.close();
  };

  $scope.rateUser = function() {
    var ratingCount = reviewUser.rating.get('ratingCount') + 1;
    var averageRating = ((reviewUser.rating.get('rating') * reviewUser.rating.get('ratingCount')) + $scope.rate)/(ratingCount);
    reviewUser.rating.set("rating", averageRating);
    reviewUser.rating.set("ratingCount", ratingCount);
    reviewUser.rating.save();
    $uibModalInstance.close();
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});

atnowApp.controller('UserDetailController', function($rootScope, $scope, $location, $log, User, $stateParams, 
  Task, userTasks, thisUser, todoTasks, pendingTasks, unclaimedTasks, awaitingConfirmationTasks){
  $scope.viewUser = thisUser;
  $scope.rating = thisUser.rating.get('rating');
  $scope.safeTasks= userTasks;

  $scope.isUser = function(){
    $log.log(thisUser);
    $log.log($rootScope.sessionUser);
    return thisUser.id === $rootScope.sessionUser.id;
  }

  $scope.current = {
    value: 'All'
  };

  if($scope.isUser()){
    $scope.current.value = 'To-do';
    $scope.safeTasks = todoTasks;
  }

  $scope.$watch(
    'current.value',
    function(newValue, oldValue) {
      if(newValue==='To-do'){
        $scope.safeTasks=todoTasks;
      }
      if(newValue==='Unclaimed'){
        $scope.safeTasks=unclaimedTasks;
      }
      if(newValue==='Pending'){
        $scope.safeTasks=pendingTasks;
      }
      if(newValue==='Awaiting Confirmation'){
        $scope.safeTasks=awaitingConfirmationTasks;
      }
      if(newValue==='All'){
        $scope.safeTasks=userTasks;
      }
    }
  );
});

atnowApp.controller('UserEditFormController', function($rootScope, $scope, $log, $state, thisUser){
  $scope.editUser= {
    phone:thisUser.phone,
    fullName:thisUser.name
  };
  $scope.thisUser = thisUser;
  $scope.profPic = {};

  $scope.confirmEdit = function(){
    var parseFile;
    var fileUploadControl = $("#profilePicture")[0];
    if (fileUploadControl.files.length > 0) {
      var file = fileUploadControl.files[0];
      var name = "profPic.png";

      parseFile = new Parse.File(name, file);
      parseFile.save().then(function(){
        thisUser.set("profilePicture", parseFile);
        thisUser.save();
      },
      function(error){
        alert("Error: " + error.code + " " + error.message);
        return error;
      });
    }
    if ($scope.editUser.phone !== thisUser.phone) {
      thisUser.set("phone", $scope.editUser.phone);
    }
    if ($scope.editUser.fullName !== thisUser.name) {
      thisUser.set("fullName", $scope.editUser.fullName);
    }
    thisUser.save();
    $state.go('app.dashboard',  {userId:$scope.thisUser.id});
  };

});

atnowApp.controller('NavBarController', function($scope, $state, $rootScope, $log, $location, myNotifications) {
  $scope.signOut = function(){
    Parse.User.logOut();
    $rootScope.sessionUser=Parse.User.current();
    $location.url("/login");
  }

  $scope.userNotifications = myNotifications;
  
  $scope.noNotifications = function(){
    return myNotifications && myNotifications.length===0;
  }
});


atnowApp.controller('LoginController', function($scope, $log, $state, $rootScope){
  $scope.newUser= {
    email:"",
    password:"",
    phone:"",
    fullName:"",
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
    var Rating = Parse.Object.extend("Rating");
    var rating = new Rating();
    rating.set("rating", 0);
    rating.set("ratingCount", 0);
    rating.save();
    var user = new Parse.User();
    user.set("username", $scope.newUser.email);
    user.set("password", $scope.newUser.password);
    user.set("email", $scope.newUser.email);
    user.set("phone", $scope.newUser.phone);
    user.set("fullName", $scope.newUser.fullName);
    user.set("rating", rating);
    user.signUp(null, {
      success: function(user) {
        $rootScope.sessionUser=user;
        $state.go("app.feed");
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
        $state.go("app.feed");
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
              $state.go("app.feed");
            });
            $stateProvider
                .state('app', {
                  url:"/app",
                  abstract:true,

                  resolve: {
                    notifications: function(User){
                        var Notification = Parse.Object.extend("Notification");
                        var query = new Parse.Query(Notification);
                        query.equalTo("owner", Parse.User.current());
                        query.include(["task.accepter"]);
                        return query.find().then(function(result){
                          return result;
                        });
                    }
                  }
                })
                .state('app.feed', {
                    url: "/feed",
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
                      },
                      myNotifications: function(notifications){
                        return notifications;
                      }
                    },
                    views:{
                        "content@": {
                          controller: 'MainFeedController',   
                          templateUrl: '/js/views/task/MainFeed.html'
                        },
                        "navbar@": {
                          controller: 'NavBarController',
                          templateUrl: '/js/views/navbar.html'
                        }
                    }
                })
                .state('app.newTask', {
                    url: "/newTask",
                    views:{
                      "content@": {
                        controller: 'TaskFormController',
                        templateUrl: '/js/views/task/NewTask.html'
                      },
                      "navbar@": {
                        controller: 'NavBarController',
                        templateUrl: '/js/views/navbar.html'
                      }
                    },
                    resolve:{
                      myNotifications: function(notifications){
                        return notifications;
                      }
                    }
                })
                .state('app.editUser', {
                    url: "/editUser/:userId",
                    views:{
                      "content@": {
                        controller: 'UserEditFormController',
                        templateUrl: '/js/views/user/UserEdit.html',
                      },
                      "navbar@": {
                        controller: 'NavBarController',
                        templateUrl: '/js/views/navbar.html'
                      }
                    },
                    resolve:{
                      thisUser: function(User, $stateParams){
                        var query = new Parse.Query(User);
                        query.include('rating');
                        return query.get($stateParams.userId).then(
                          function(result){
                            return result;
                          },
                          function(error){
                            return error;
                          });
                      },
                      myNotifications: function(notifications){
                        return notifications;
                      }
                    }
                })
                .state('app.dashboard', {
                    url: "/dashboard/:userId",
                    views:{
                      "content@": {
                        controller: 'UserDetailController',
                        templateUrl: '/js/views/user/UserDetail.html'
                      },
                      "navbar@": {
                        controller: 'NavBarController',
                        templateUrl: '/js/views/navbar.html'
                      }
                    },
                    resolve:{
                      //we should do this on the client side
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
                        query.include('rating');
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
                            accepterQuery.equalTo("accepted", true);
                            accepterQuery.equalTo("completed", false);
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
                      },
                      unclaimedTasks: function(Task, User, $stateParams){
                        var query = new Parse.Query(User);
                        return query.get($stateParams.userId).then(
                          function(result){
                            var accepterQuery = new Parse.Query(Task);
                            accepterQuery.equalTo("accepted", false);
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
                      },
                      awaitingConfirmationTasks: function(Task, User, $stateParams){
                        var query = new Parse.Query(User);
                        return query.get($stateParams.userId).then(
                          function(result){
                            var accepterQuery = new Parse.Query(Task);
                            accepterQuery.equalTo("confirmed", false);
                            accepterQuery.equalTo("completed", true);
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
                      },
                      myNotifications: function(notifications){
                        return notifications;
                      }
                    }
                })
                .state('app.taskDetail', {
                    url: "/task/:taskId",
                    views:{
                      "content@": {
                        controller: 'TaskController',
                        templateUrl: '/js/views/task/TaskPage.html'
                      },
                      "navbar@": {
                        controller: 'NavBarController',
                        templateUrl: '/js/views/navbar.html'
                      }
                    },
                    resolve:{
                      taskDetail:function(Task, $stateParams) {
                        var query = new Parse.Query(Task);
                        query.include('requester');
                        query.include('accepter');
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
                      },
                      myNotifications: function(notifications){
                        return notifications;
                      }
                    }
                })
                .state('login', {
                    url: "/login",
                    views:{
                      "content": {
                        controller: "LoginController",
                        templateUrl: "/js/views/user/Login.html"
                      },
                      "navbar": {
                        controller: 'NavBarController',
                        templateUrl: '/js/views/navbar.html'
                      }
                    },
                    resolve:{
                      myNotifications: function(){
                        return undefined;
                      }
                    }
                });


    });

atnowApp.run(function($rootScope, $state, $log, $location, User) {
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

atnowApp.factory("Rating", function(){
  var Rating = Parse.User.extend("Rating");
  Object.defineProperty(User.prototype, "rating", {
    get: function() {
      return this.get("rating");
    },
    set: function(val) {
      this.set(name, val);
    }
  });
  Object.defineProperty(User.prototype, "ratingCount", {
    get: function() {
      return this.get("ratingCount");
    },
    set: function(val) {
      this.set(email, val);
    }
  });
  return Rating;
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
  Object.defineProperty(User.prototype, "profilePicture", {
    get: function() {
      return this.get("profilePicture");
    },
    set: function(val) {
      this.set(rating, val);
    }
  });
  Object.defineProperty(User.prototype, "rating", {
    get: function() {
      return this.get("rating");
    },
    set: function(val) {
      this.set(rating, val);
    }
  })
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
  Object.defineProperty(Task.prototype, "requester", {
      get: function() {
        return this.get("requester");
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
  Object.defineProperty(Task.prototype, "confirmed", {
      get: function() {
        return this.get("confirmed");
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

