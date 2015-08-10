var timenow=Date.now();
moment.locale('es');
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
        $location.url("/App/Evento/"+id);
    };
    ///FB LOGIN
    $scope.loginFB = function(){
        $http.post("/API/Login",{
            correo:"test@zamka.org",
            password:null,
            fbid:511882046
        }).success(function(data){
            $log.log("--SUCCESS--");
            $log.log("data:",data);
        });
    };
    // LOGIN
    $scope.login = function(correo,password,fbid){
        $http.post("/API/Login",{
            correo:correo,
            password:password,
            fbid:fbid
        }).success(function(data){
            $log.log("--SUCCESS--");
            $log.log("data:",data);
            $scope.usuario = {
                email:data.email,
                fbid:data.facebookID,
                foto:data.image.url,
                nombre:data.name
            };
            if (data.objectId){
                $location.url("/App/Eventos");
            }
        }).error(function(data){
            $log.log("--Error--");
            $log.log("data:",data);
        });
    };
    //CATEGORIAS
    $scope.getCategorias = function(){
        $http.get("/API/Categorias").success(function(data){
            $scope.categorias = [];
            for (key in data){
                $scope.categorias.push(data[key].Nombre);
            }
            $log.log("Categorias:",$scope.categorias);
        });
    }
    ///EVENTOS
    $scope.getEventos = function(){
        $http.get("/API/Buscar?busqueda=").success(function(data){
            $scope.eventos = [];
            for (key in data){
                var evento = data[key];
                $scope.eventos.push({
                    categoria:evento.Categorias[0],
                    descripcion:evento.Descripcion,
                    fecha:evento.Fecha.iso,
                    nombre:evento.Nombre,
                    foto:evento.Imagen.url,
                    id:evento.objectId
                });
            }
            $log.log("Eventos:",$scope.eventos);
        });
    };
    //EVENTO
        $scope.getEvento = function(id){
            $http.get("/API/Evento?idEvento="+id).success(function(data){

                /*
                Falta fotos, comentarios y datos de organizacion
                */
                $log.log("data:",data);
                $scope.evento={
                    categoria:data.Categorias[0],
                    contenido:data.Contenido,
                    descripcion:data.Descripcion,
                    fecha:data.Fecha,
                    nombre:data.Nombre,
                    foto:data.Imagen["_url"],
                    comentarios:[],
                    fotos: [],
                    org:{
                        nombre:data.Organizacion.Nombre,
                        id:data.Organizacion.objectId,
                        foto:data.Organizacion.Foto.url
                    }
                };
                for (key in data.Comentarios){
                    $scope.evento.comentarios.push({
                        usuario:{
                            nombre:data.Comentarios[key].Nombre,
                            foto:data.Comentarios[key].Foto["_url"],
                            id:data.Comentarios[key].idUsuario,
                            fecha:data.Comentarios[key].Fecha
                        },
                        comentario:data.Comentarios[key].Comentario
                    })
                }
                for(key in data.Fotos){
                    $scope.evento.fotos.push(data.Fotos[key].Archivo.url);
                }
                $log.log("Evento:",$scope.evento);
            });
        };

    //UTIL

    $scope.showDate = function(iso){
        return moment(iso).format("Do MMM YYYY");
    }
    $scope.timeSince = function(iso){
        return moment(iso).fromNow();
    }
    $scope.verFecha = function(){
        $log.log("fecha:",$scope.fechafecha);
    }



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
        $scope.evento = {};
    $scope.searchCategoria = function(){

    };
    $scope.getCategorias();
    $scope.getEventos();

})
.controller('eventoCtrl',function($scope,$timeout,$location,$routeParams){
        $scope.getEvento($routeParams.id);
})
.controller('perfilCtrl',function($scope,$timeout,$location){

})
.controller('ongCtrl',function($scope,$timeout,$location){

});