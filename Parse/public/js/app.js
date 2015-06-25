angular.module('ZamkaAdmin', ['ngMaterial','ngRoute'])
.config(function($mdThemingProvider,$routeProvider,$interpolateProvider) {
  $routeProvider
      .when('/', {
      templateUrl: '/partials/app/index.html',
      controller: 'indexCtrl'
      })
      .when('/Login', {
        templateUrl: '/partials/app/login.html',
        controller: 'indexCtrl'
      })
      .when('/Eventos', {
        templateUrl: '/partials/app/eventos.html',
        controller: 'indexCtrl'
      })
      .when('/Evento/:id', {
        templateUrl: '/partials/app/evento.html',
        controller: 'indexCtrl'
      })
      .when('/Perfil/:id', {
        templateUrl: '/partials/app/perfil.html',
        controller: 'indexCtrl'
      })
      .when('/ONG/:id', {
        templateUrl: '/partials/app/ong.html',
        controller: 'indexCtrl'
      });
  $mdThemingProvider.theme('default')
    .primaryPalette('light-blue')
    .accentPalette('grey');
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
})
.controller('AppCtrl', function($scope, $mdSidenav){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
})
.controller('indexCtrl',function($scope){

});