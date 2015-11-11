var timenow = Date.now();
angular.module('ZamkaAdmin', ['ngMaterial','ngRoute','ngStorage'])
    .config(function($mdThemingProvider,$routeProvider,$interpolateProvider,$locationProvider) {
        $routeProvider
            .when('/Admin', {
                templateUrl: '/partials/admin/index.html',
                controller: 'indexCtrl'
            })
            .when('/Admin/estadisticas', {
                templateUrl: '/partials/admin/estadisticas.html',
                controller: 'estaCtrl'
            })
            .when('/Admin/eventos', {
                templateUrl: '/partials/admin/eventos.html',
                controller: 'eventosCtrl'
            })
            .when('/Admin/perfil', {
                templateUrl: '/partials/admin/perfil.html',
                controller: 'perfilCtrl'
            })
            .when('/Admin/evento/:id', {
                templateUrl: '/partials/admin/evento.html',
                controller: 'eventoCtrl'
            })
            .when('/Admin/eventoStat/:id', {
                templateUrl: '/partials/admin/eventostat.html',
                controller: 'eventoStatCtrl'
            });
        $mdThemingProvider.theme('default')
            .primaryPalette('pink')
            .accentPalette('grey');
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
        $locationProvider.html5Mode(true);
    })
    .controller('AppCtrl',function($scope, $mdSidenav,$http,$log,$location,$localStorage){
        $scope.sideNavOpen = false;
        $scope.organizacion = {};
        if($localStorage.organizacion != null)
            $scope.organizacion = $localStorage.organizacion;
        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };
        $scope.timestamp = function(){
            return timenow;
        };
        $scope.login = function(usuario,password){
            $http.post("/API/Admin/Login",{usuario:usuario,password:password})
                .success(function(data){
                    $log.log(data);
                    $location.url("/Admin/eventos");
                    $scope.organizacion = data;
                    $localStorage.organizacion = data;

                    //$scope.subirFoto(imgTestBase64,$scope.organizacion.objectId);
                })
                .error(function(error){
                    $log.log(error);
                });
        };
        $scope.getEventos = function(idONG){
            $scope.eventos = [];
            $http.get("/API/Admin/Eventos?idONG="+idONG)
                .success(function(data){
                    $log.log(data);
                    $scope.eventos = data;
                })
                .error(function(error){
                    $log.log(error)
                });
        };
        $scope.getComentariosOng = function(idONG){
            $scope.eventos = [];
            $http.get("/API/ComentariosOng?idONG="+idONG)
                .success(function(data){
                    $log.log(data);
                    $scope.organizacion.comentarios = data;
                })
                .error(function(error){
                    $log.log(error)
                });
        };
        $scope.subirFoto = function(foto,idONG){
            $http.post("/API/Admin/SubirImagen",{
                imagen:{base64:foto},
                idONG:idONG
            })
                .success(function(data){
                    $log.log(data);
                    var foto = data;
                    $scope.crearEvento(
                        "Evento de Prueba API",
                        "Descripcion del evento",
                        "<strong>Contenido del evento aca deberia ser HTML</strong>",
                        ["Artes","Deportes","Construcción"],
                        foto.objectId,
                        [foto.objectId,foto.objectId,foto.objectId],
                        $scope.organizacion.objectId
                    );
                })
                .error(function(error){
                    $log.log(error);
                });
        };
        $scope.crearEvento = function(nombre,descripcion,contenido,categorias,foto,fotos,idONG){
            $http.post("/API/Admin/CrearEvento",{
                nombre:nombre,
                descripcion:descripcion,
                contenido:contenido,
                categorias:categorias,
                foto:foto,
                fotos:fotos,
                idONG:idONG
            })
                .success(function(data){
                    $log.log(data);
                })
                .error(function(error){
                    $log.log(error);
                });
        };
        $scope.editarEvento = function(nombre,descripcion,contenido,cover,categorias,fotos,idEvento){
            $http.put("/API/Admin/Evento",{
                nombre:nombre,
                descripcion:descripcion,
                contenido:contenido,
                cover:cover,
                categorias:categorias,
                fotos:fotos,
                idEvento:idEvento
            })
                .success(function(data){
                    $log.log(data);
                })
                .error(function(error){
                    $log.log(error);
                });
        };


        // UTILITIES

        $scope.showDate = function(iso){
            return moment(iso).format("Do MMM YYYY");
        }
        $scope.timeSince = function(iso){
            return moment(iso).fromNow();
        }
    })
    .controller('indexCtrl',function($scope,$mdToast,$timeout){
        $scope.lala = "lala";
        $timeout(function(){
            $mdToast.show(
                $mdToast.simple()
                    .content('Por favor Ingrese con su cuenta de Zamka ONG')
                    .position('bottom')
                    .hideDelay(3000)
            );
        },500,false);

    })
    .controller('estaCtrl',function($scope,$mdToast,$timeout){
        $timeout(function(){
            new Morris.Line({
                element: 'participantes',
                data: [
                    { Año: '2008', Participantes: 200 },
                    { Año: '2009', Participantes: 100 },
                    { Año: '2010', Participantes: 50 },
                    { Año: '2011', Participantes: 50 },
                    { Año: '2012', Participantes: 200 }
                ],
                xkey: 'Año',
                ykeys: ['Participantes'],
                labels: ['Participantes']
            });
            new Morris.Donut({
                element:'sexos',
                data:[{label:'Hombres',value:300},{label:'Mujeres',value:400}],
                colors:['#91B9D9','pink']
            });
            new Morris.Bar({
                element:'eventos',
                data: [
                    { evento: '2008 - Evento 1', Participantes: 200 },
                    { evento: '2009 - Evento 2', Participantes: 100 },
                    { evento: '2010 - Evento 3', Participantes: 50 },
                    { evento: '2011 - Evento 4', Participantes: 50 },
                    { evento: '2012 - Evento 5', Participantes: 200 }
                ],
                xkey: 'evento',
                ykeys: ['Participantes'],
                labels: ['Participantes']
            });
        },1000);

    })
    .controller('eventosCtrl',function($scope,$timeout,$log,$mdSidenav){
        $scope.$parent.sideNavOpen = true;
        $scope.getEventos($scope.organizacion.idOrganizacion);

    })
    .controller('eventoCtrl',function($scope, $routeParams,$log,$mdDialog){

        $scope.eventoID = $routeParams.id;
        $scope.nombre = "Nombre del Evento";
        $scope.desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...";
        $scope.contenido = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

        $scope.tituloDialog = function(ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: '/partials/admin/templates/titulo.html',
                targetEvent: ev,
                resolve: {
                    texto: function () {
                        return $scope.nombre;
                    }}
            })
                .then(function(answer) {
                    $scope.nombre = answer
                }, function() {
                    //Se cancelo
                });
        };

        $scope.descDialog = function(ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: '/partials/admin/templates/descripcion.html',
                targetEvent: ev,
                resolve: {
                    texto: function () {
                        return $scope.desc;
                    }}
            })
                .then(function(answer) {
                    $scope.desc = answer
                }, function() {
                    //Se cancelo
                });
        }

        $scope.conDialog = function(ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: '/partials/admin/templates/contenido.html',
                targetEvent: ev,
                resolve: {
                    texto: function () {
                        return $scope.contenido;
                    }}
            })
                .then(function(answer) {
                    $scope.contenido = answer
                }, function() {
                    //Se cancelo
                });
        }

    })
    .controller('perfilCtrl',function($scope){
        $scope.$parent.sideNavOpen = true;
        $scope.getEventos($scope.organizacion.idOrganizacion);
        $scope.getComentariosOng($scope.organizacion.idOrganizacion);


    })
    .controller('eventoStatCtrl',function($scope,$http,$log){
        $http.get('http://api.randomuser.me/?results=20&nat=es').success(function(data){
            $scope.usuarios = data.results;
            $log.log($scope.usuarios);
        });
    });




function DialogController($scope, $mdDialog, $log,texto,$mdToast) {
    $scope.texto = texto;
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.ok = function() {
        $mdDialog.hide($scope.texto);
    };
    $scope.okDesc = function() {
        $log.log($scope);
        $log.log($scope.texto);

        if(!$scope.texto){
            $mdToast.show(
                $mdToast.simple()
                    .content('Se exedio del limite de caracteres')
                    .position('top')
                    .hideDelay(2000)
            );
        }else{
            $mdDialog.hide($scope.texto);
        }

    };
}