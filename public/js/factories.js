
angular.module('atnowApp').factory("Rating", function(){
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

angular.module('atnowApp').factory("User", function(){
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
  Object.defineProperty(User.prototype, "venmoAccessToken", {
    get: function() {
      return this.get("venmoAccessToken");
    },
    set: function(val) {
      this.set(venmoAccessToken, val);
    }
  });
  Object.defineProperty(User.prototype, "venmoPhoneNumber", {
    get: function() {
      return this.get("venmoPhoneNumber");
    },
    set: function(val) {
      this.set(venmoPhoneNumber, val);
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
  return User;
});

angular.module('atnowApp').factory("Task", function(){
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
  Object.defineProperty(Task.prototype, "requiresCar", {
    get: function() {
      return this.get("requiresCar");
    },
    set: function(val) {
      this.set(requiresCar, val);
    }
  });
  Object.defineProperty(Task.prototype, "requiresLifting", {
    get: function() {
      return this.get("requiresLifting");
    },
    set: function(val) {
      this.set(requiresLifting, val);
    }
  });
  Object.defineProperty(Task.prototype, "requiresPurchase", {
    get: function() {
      return this.get("requiresPurchase");
    },
    set: function(val) {
      this.set(requiresPurchase, val);
    }
  });
  return Task;
});

angular.module('atnowApp').factory('TaskCode', function($state, $timeout, $uibModal, $rootScope){

    var root = {};

    root.relinquishTask = function(task){
      task.set("accepter", null);
      task.set("accepted", false);
      task.save();
      root.reload('feed');
    }

    root.completeTask = function(task){
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/js/views/task/TaskRating.html',
        controller: 'TaskModalController',
        size: 'sm',
        windowClass: 'app-modal-window',
        resolve: {
          reviewUser: function (User) {
            var query = new Parse.Query(User);
            query.include('rating');
            return query.get(task.requester.id).then({
              success: function(result) {
                return result;
              },
              error: function(error) {
                alert("Error: " + error.code + " " + error.message);
                return error;
              }
            });
          },
          payment: function(){
            return false;
          },
          title: function(){
            return "NA";
          }
        }
      });
      modalInstance.result.then(function () {
        task.set("completed", true);
        var description = "Your task " + task.title + " was completed by " + task.get('accepter').get('fullName');
        var Notification = Parse.Object.extend("Notification");
        var notification = new Notification();
        notification.save({type:"completed", task: task, message:description, isRead: false, owner: task.get("requester")});
        task.save();
        root.reload('dashboard');
      });
    }

    root.claimTask = function(task, sessionUser){
      task.set("accepter", sessionUser);
      task.set("accepted", true);
      var description = "Your task " + task.title + " was claimed by " + sessionUser.get('fullName');
      var Notification = Parse.Object.extend("Notification");
      var notification = new Notification();
      notification.save({type:"claimed", task: task, message: description, isRead: false, owner: task.get("requester")});
      task.save();
      root.reload('dashboard');
    }

    root.confirmTask = function(task, sessionUser){
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/js/views/task/TaskRating.html',
        controller: 'TaskModalController',
        windowClass: 'app-modal-window',
        size: 'sm',
        resolve: {
          reviewUser: function (User) {
            var query = new Parse.Query(User);
            query.include('rating');
            return query.get(task.accepter.id).then({
              success: function(result) {
                return result;
              },
              error: function(error) {
                alert("Error: " + error.code + " " + error.message);
                return error;
              }
            });
          },
          payment: function () {
            return task.price;
          },
          title: function () {
            return task.title;
          }
        }
      });

      modalInstance.result.then(function () {
        var description = task.get('requester').get('fullName') + " confirmed your completion of " + task.title;
        var Notification = Parse.Object.extend("Notification");
        var notification = new Notification();
        notification.save({type:"confirmed", task: task, message:description, isRead: false, owner: task.accepter});
        task.set("confirmed", true);
        task.save();
        root.reload('dashboard');
        });
    }

    root.newTask = function(sessionUser) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/js/views/task/CreateTaskModal.html',
        controller: 'TaskFormController',
        windowClass: 'app-modal-window'
      });
    }

    root.reportUser = function(task){
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/js/views/task/Report.html',
        controller: 'TaskModalController',
        windowClass: 'app-modal-window',
        resolve: {
          reviewUser: function (User) {
            var query = new Parse.Query(User);
            return query.get(task.accepter.id).then({
              success: function(result) {
                return result;
              },
              error: function(error) {
                alert("Error: " + error.code + " " + error.message);
                return error;
              }
            });
          },
          payment: function () {
            return task.price;
          },
          title: function () {
            return task.title;
          }
        }
      });
      modalInstance.result.then(function () {
        task.set("accepter", null);
        task.set("accepted", false);
        task.set("completed", false);
        task.save();
      });
    }

    root.deleteTask = function(task, sessionUser){
      var result = confirm("Are you sure you want to delete " + task.title);
      if (result == true){
        task.destroy({});
        root.reload('dashboard');
        return true;
      }
      return false;
    }

    root.reload = function(page){
      if (page === 'feed'){
        $timeout(function () {
          $state.go('app.feed', {}, { reload: true });
        }, 100);
      } else if (page === 'dashboard') {
        $timeout(function () {
          $state.go('app.dashboard', {userId:$rootScope.sessionUser.id}, { reload: true });
        }, 100);
      }
    }

    root.timeRemaining = function(expiration){
      var oneDay = 24*60*60*1000;
      var oneHour = 60*60*1000;
      var oneMinute = 60*1000;
      var difference = expiration.getTime() - new Date().getTime();
      var days = Math.floor((expiration.getTime() - new Date().getTime())/oneDay);
      var hours = Math.floor((expiration.getTime() - new Date().getTime() - (days * oneDay))/oneHour);
      var minutes = Math.floor((expiration.getTime() - new Date().getTime() - (days * oneDay) - (hours * oneHour))/oneMinute);

      if (days < 0 || hours < 0 || minutes < 0) {
        return 'expired';
      }

      var result = '';

      if (days !== 0) {
        result += days + 'd ';
      }
      if (hours !== 0) {
        result += hours + 'h ';
      }
      result += minutes + 'm';

      return result;
    }

    return root;
});
