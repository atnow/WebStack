angular
  .module('atnowApp')
  .controller('TaskModalController', function ($scope, $uibModalInstance, $rootScope, reviewUser){
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