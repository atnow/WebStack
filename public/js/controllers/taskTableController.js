angular
	.module('atnowApp')
	.controller("TaskTableController", function($scope, Task, $uibModal, TaskCode){
		$scope.requirementsShown={
			car:true,
			purchase:true,
			physical:true
		};
	  $scope.allTasks=[].concat($scope.safeTasks);
	  $scope.itemsByPage=10;
		$scope.taskCode = TaskCode;

	  $scope.emptyTasks = function(){
	    return $scope.safeTasks.length === 0;
	  }
		//copied code for notifications in NavBarController
	  $scope.openTaskModal = function(task, Task){
		var modalInstance = $uibModal.open({
	    animation: true,
	    templateUrl: '/js/views/task/TaskModal.html',
			windowClass: 'app-modal-window',
	    controller: 'TaskFeedModalController',
	    resolve: {
	    	task: function (Task) {
                var query = new Parse.Query(Task);
                query.include('requester');
                query.include('accepter');
                return query.get(task.id).then({
                  success: function(result) {
                    return result;
                  },
                  error: function(error)
									 {
                    alert("Error: " + error.code + " " + error.message);
                    return error;
                  }
                });
	          }
	        }
	    });
	  }

		/*$scope.$watch('requirementsShown.car', function() {
				if(!$scope.requirementsShown.car){
					$scope.safeTasks=[].concat($scope.safeTasks.filter(requiresNoCar));
				}
				else{
					applyFilters();
				}
    });

		$scope.$watch('requirementsShown.purchase', function() {
				if(!$scope.requirementsShown.purchase){
					$scope.safeTasks=[].concat($scope.safeTasks.filter(requiresNoPurchase));
				}
				else{
					applyFilters();
				}
		});

		$scope.$watch('requirementsShown.physical', function() {
				if(!$scope.requirementsShown.physical){
					$scope.safeTasks=[].concat($scope.safeTasks.filter(requiresNoLifting));
				}
				else{
					applyFilters();
				}
		});*/

		requiresNoCar=function(value){
			return !value.requiresCar;
		};

		requiresNoPurchase=function(value){
			return !value.requiresPurchase;
		};

		requiresNoLifting=function(value){
			return !value.requiresLifting;
		};

		$scope.applyFilters=function(value){
			$scope.safeTasks=[].concat($scope.allTasks);
			if(!$scope.requirementsShown.car){
				$scope.safeTasks=[].concat($scope.safeTasks.filter(requiresNoCar));
			}
			if(!$scope.requirementsShown.purchase){
				$scope.safeTasks=[].concat($scope.safeTasks.filter(requiresNoPurchase));
			}
			if(!$scope.requirementsShown.physical){
				$scope.safeTasks=[].concat($scope.safeTasks.filter(requiresNoLifting));
			}

		};

});
