angular
  .module('atnowApp')
  .config(

        function ($stateProvider, $urlRouterProvider, $provide, $controllerProvider) {

            angular.module('atnowApp').controller = $controllerProvider.register;

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
                        query.ascending("createdAt");
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
                      requesterTasks: function(Task, User, $stateParams){
                        var query = new Parse.Query(User);
                        return query.get($stateParams.userId).then(
                          function(result){
                            var requesterQuery = new Parse.Query(Task);
                            requesterQuery.equalTo("requester", result);
                            return requesterQuery.find().then(
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
                      accepterTasks: function(Task, User, $stateParams){
                        var query = new Parse.Query(User);
                        return query.get($stateParams.userId).then(
                          function(result){
                            var accepterQuery = new Parse.Query(Task);
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
                .state('app.verifyEmail', {
                    url: "/verifyemail",
                    views:{
                      "content@": {
                        controller: 'VerifyController',
                        templateUrl: '/js/views/verify.html'
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
                .state('landing', {
                  url: "/",
                  views:{
                    "content": {
                      controller: "LandingController",
                      templateUrl: '/js/views/landing.html'
                    },
                    "navbar": {
                      controller: 'LandingNavController',
                      templateUrl: '/js/views/landingNav.html'
                    }
                  }
                });
});
