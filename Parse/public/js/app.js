angular.module('ZamkaAdmin', ['ngMaterial','ngRoute'])
.config(function($mdThemingProvider,$routeProvider) {
  $routeProvider
	.when('/', {
    templateUrl: '/partials/app/index.html',
    controller: 'indexCtrl'
  	});
  $mdThemingProvider.theme('default')
    .primaryPalette('lightblue')
    .accentPalette('grey');
})
.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
}])
.controller('indexCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
}]);