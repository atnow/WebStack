angular
  .module('atnowApp')
  .controller('LoginController', function($scope, $log, $state, $rootScope){
  	$log.log($.url.attr('code'));
  });