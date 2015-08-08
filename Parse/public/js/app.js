var timenow=Date.now();
angular.module('ZamkaAdmin', ['ngMaterial','ngRoute'])
.config(function($mdThemingProvider,$routeProvider,$interpolateProvider,$locationProvider) {
  $routeProvider
      .when('/App', {
      templateUrl: '/partials/app/index.html',
      controller: 'indexCtrl'
      })
      .when('/App/Login', {
        templateUrl: '/partials/app/login.html',
        controller: 'loginCtrl'
      })
      .when('/App/SignUp', {
          templateUrl: '/partials/app/signup.html',
          controller: 'signupCtrl'
      })
      .when('/App/Eventos', {
        templateUrl: '/partials/app/eventos.html',
        controller: 'eventosCtrl'
      })
      .when('/App/Evento/:id', {
        templateUrl: '/partials/app/evento.html',
        controller: 'eventoCtrl'
      })
      .when('/App/Perfil/:id', {
        templateUrl: '/partials/app/perfil.html',
        controller: 'perfilCtrl'
      })
      .when('/App/ONG/:id', {
        templateUrl: '/partials/app/ong.html',
        controller: 'ongCtrl'
      });
  $mdThemingProvider.theme('default');
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
})
.controller('AppCtrl', function($scope){

})
.controller('indexCtrl',function($scope,$timeout,$location){
$timeout(function(){
    $location.url("/App/Login");
},2000,true);

})
.controller('loginCtrl',function($scope,$timeout,$location){

})
.controller('signupCtrl',function($scope,$timeout,$location){

})
.controller('eventosCtrl',function($scope,$timeout,$location){
    $scope.searchCategoria = function(){

    };
    $scope.irEvento = function(id){
        $location.url("/App/Evento/1");
    };
})
.controller('eventoCtrl',function($scope,$timeout,$location){

})
.controller('perfilCtrl',function($scope,$timeout,$location){

})
.controller('ongCtrl',function($scope,$timeout,$location){

});