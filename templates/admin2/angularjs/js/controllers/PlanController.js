MetronicApp.controller('PlanController', function($rootScope, $scope, $http, $timeout,$location,$modal,$state, Restangular) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		Metronic.initAjax();
		dashboard.checkSession();

	});

});