describe('LoginController', function() {
	beforeEach(module('atnowApp'));

	var $controller;

	beforeEach(inject(function(_$controller_){
		$controller = _$controller_;
	}));

	beforeEach(function(){
		Parse.initialize("0oeGyi6DM6AwliCkDTBxr14OLcrgV3MYx1Gc4wHK", "Lba978MC6EMU6g7msUvLiUHza8vjkqGVf1Qq1eSo"); 
	});

	describe('$scope.login', function() {
		it('logs in', function() {
			var $scope = {};
			var controller = $controller('LoginController', { $scope: $scope });
			$scope.loginUser.email = "testUser@dartmouth.edu";
			$scope.loginUser.password = "password";
			$scope.login();
			expect($rootScope.user).toEqual(!null);
		});
	});
});