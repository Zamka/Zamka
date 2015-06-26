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
        controller: 'indexCtrl'
      })
      .when('/App/ONG/:id', {
        templateUrl: '/partials/app/ong.html',
        controller: 'indexCtrl'
      });
  $mdThemingProvider.theme('default')
    .primaryPalette('light-blue')
    .accentPalette('grey');
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
      $locationProvider.html5Mode(true);
})
.controller('AppCtrl', function($scope, $mdSidenav){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
      $scope.timestamp = function(){
        return timenow;
      }
})
.controller('indexCtrl',function($scope,$timeout,$location){
        $(".logo").hide();
        $timeout(function(){
            new WOW().init();
            $(".logo").show();
        },500,false);

        $timeout(function(){
            $(".logo").addClass("animated");
            $(".logo").addClass("fadeOutLeft");

            $timeout(function(){
                $location.path("/App/Login");
                $scope.$apply();
            },1000,false);
        },3000,false);
})
.controller('loginCtrl',function($scope,$timeout,$location){
    $(".contenedor").hide();
    $timeout(function(){
        new WOW().init();
        $(".contenedor").show();
    },500,false);

    $scope.login = function(){
        $(".contenedor").addClass("animated");
        $(".contenedor").addClass("fadeOutLeft");
        $timeout(function(){
            $location.path("/App/Eventos");
            $scope.$apply();
        },1000,false);
    }

})
.controller('eventosCtrl',function($scope,$timeout,$location){
        $scope.eventos = [
            {nombre:"Evento 5",img:"/img/Picture5.jpg",href:"/admin/#/evento/5",descripcion:"Este es un evento y aca una descripcion corta de lo que se trata"},
            {nombre:"Evento 4",img:"/img/Picture4.jpg",href:"/admin/#/evento/4",descripcion:"Este es un evento y aca una descripcion corta de lo que se trata"},
            {nombre:"Evento 3",img:"/img/Picture3.jpg",href:"/admin/#/evento/3",descripcion:"Este es un evento y aca una descripcion corta de lo que se trata"},
            {nombre:"Evento 2",img:"/img/Picture2.jpg",href:"/admin/#/evento/2",descripcion:"Este es un evento y aca una descripcion corta de lo que se trata"},
            {nombre:"Evento 1",img:"/img/Picture1.jpg",href:"/admin/#/evento/1",descripcion:"Este es un evento y aca una descripcion corta de lo que se trata"}];

    $(".contenedor").hide();
    $timeout(function(){
        new WOW().init();
        $(".contenedor").show();
    },500,false);

    $scope.irEvento = function(id){
        $(".main").addClass("animated");
        $(".main").addClass("fadeOutLeft");
        $timeout(function(){
            $location.path("/App/Evento/"+id);
            $scope.$apply();
        },1000,false);
    }
})
.controller('eventoCtrl',function($scope,$timeout,$location){
        $scope.evento=
            {nombre:"Techo",
            descripcionC: "Techo es una organización no gubernamental (ONG) latinoamericana, sin inclinaciones políticas ni religiosas, orientada a superar la extrema pobreza, a través del trabajo de jóvenes voluntarios y pobladores de asentamientos precarios, quienes en un trabajo conjunto, buscan soluciones concretas para obtener una vivienda digna y así combatir la desigualdad social.",
            fotoP:"img/techo.png",
            ong:"ONG1",
            ubicacion:"lurin",
            fecha:"12/10/15",
            fotoS:"img/techo.png"};

    $(".contenedor").hide();
    $timeout(function(){
        new WOW().init();
        $(".contenedor").show();
    },500,false);
});