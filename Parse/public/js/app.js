var timenow=Date.now();
angular.module('ZamkaAdmin', ['ngMaterial','ngRoute','mdDateTime'])
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
      })
      .when('/App/MiCuenta', {
          templateUrl: '/partials/app/mispeticiones.html',
          controller: 'perfilCtrl'
      });
  $mdThemingProvider.theme('default');
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
})
.controller('AppCtrl', function($scope,$timeout,$location,$http,$log){
    $scope.irEvento = function(id){
        $location.url("/App/Evento/1");
    };

    $scope.login = function(correo,password,fbid){
        $http.post("/API/Login",{
            correo:correo,
            password:password,
            fbid:fbid
        }).success(function(data){
            $log.log(data);
        });
    };




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

})
.controller('eventoCtrl',function($scope,$timeout,$location){

})
.controller('perfilCtrl',function($scope,$timeout,$location){

})
.controller('ongCtrl',function($scope,$timeout,$location){

});