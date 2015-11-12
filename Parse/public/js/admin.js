var timenow = Date.now();
angular.module('ZamkaAdmin', ['ngMaterial','ngRoute','ngStorage','ngMessages','ngImgCrop'])
    .config(function($mdThemingProvider,$routeProvider,$interpolateProvider,$locationProvider) {
        $routeProvider
            .when('/Admin', {
                templateUrl: '/partials/admin/index.html',
                controller: 'indexCtrl'
            })
            .when('/Admin/Eventos', {
                templateUrl: '/partials/admin/eventos.html',
                controller: 'eventosCtrl'
            })
            .when('/Admin/CrearEvento', {
                templateUrl: '/partials/admin/crearevento.html',
                controller: 'crearEventoCtrl'
            })
            .when('/Admin/Perfil', {
                templateUrl: '/partials/admin/perfil.html',
                controller: 'perfilCtrl'
            })
            .when('/Admin/Evento/:id', {
                templateUrl: '/partials/admin/evento.html',
                controller: 'eventoCtrl'
            })
            .when('/Admin/EventoLista/:id', {
                templateUrl: '/partials/admin/eventostat.html',
                controller: 'eventoStatCtrl'
            });
        $mdThemingProvider.theme('default')
            .primaryPalette('pink', {
                'default': '500',
                'hue-1': '100',
                'hue-2': '400',
                'hue-3': '900'
            })
            .accentPalette('grey', {
                'default': '500',
                'hue-1': '400',
                'hue-2': '700',
                'hue-3': '900'
            });
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
                    $location.url("/Admin/Eventos");
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
        $scope.getCategorias = function(){
            $scope.cargando = true;
            $http.get("/API/Categorias").success(function(data){
                $scope.categorias = [];
                for (key in data){
                    $scope.categorias.push(data[key].Nombre);
                }
                $scope.cargando = false;
                $log.log("Categorias:",$scope.categorias);
            });
        }

        $scope.getParticipantes = function(idEvento){
            $log.log("getParticipantes");
            $scope.participantes = {
                pendientes:[],
                aprobados:[],
                rechazados:[]
            };
            $http.get("/API/Admin/Participantes?idEvento="+idEvento).success(function(data){
                $log.log(data);
                for (var key in data){
                    switch (data[key].estado){
                        case 0:
                            $scope.participantes.pendientes.push(data[key]);
                            break;
                        case 1:
                            $scope.participantes.aprobados.push(data[key]);
                            break;
                        case 2:
                            $scope.participantes.rechazados.push(data[key]);
                            break;
                    }
                }
            }).error(function(err){
                $log.log(err);
            });
        }

        // UTILITIES

        $scope.showDate = function(iso){
            return moment(iso).format("Do MMM YYYY");
        }
        $scope.timeSince = function(iso){
            return moment(iso).fromNow();
        }
        $scope.goTo = function(sitio){
            $location.url(sitio);
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
    .controller('eventosCtrl',function($scope,$timeout,$log,$mdSidenav){
        $scope.$parent.sideNavOpen = true;
        $scope.getEventos($scope.organizacion.idOrganizacion);

    })
    .controller('crearEventoCtrl',function($scope, $routeParams,$log,$mdDialog,$timeout){
        $scope.getCategorias();
        $scope.minDate = new Date();
        $scope.fotos=[];
        $scope.showCropped = function(){
            $scope.fotos.push($scope.myCroppedImage);
            $log.log($scope.myCroppedImage);
        }

        $scope.fistFoto = function(){
            if($scope.fotos[0] == undefined){
                return "http://mave.me/img/projects/full_placeholder.png";
            }else{
                return $scope.fotos[0];
            }
        }
        $scope.getBg = function(){
            return {
                'background-image':'url(' + $scope.fistFoto() + ')'
            }
        }


        $scope.loadImage = function(){
            $timeout(function(){
                $log.log(document.getElementById("fileInput"));
                document.getElementById("fileInput").click();},500);
            $scope.showAdvanced();
        };

        $scope.showAdvanced = function(ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: '/partials/admin/templates/subirFoto.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
                .then(function (answer) {
                    $scope.fotos.push(answer);
                    $log.log(answer);
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        };
        function DialogController($scope, $mdDialog,$timeout,$log) {

            $scope.myImage='';
            $scope.myCroppedImage='';


            angular.element(document.querySelector('#fileInput')).on('change',function(evt) {
                var file=evt.currentTarget.files[0];
                var reader = new FileReader();
                reader.onload = function (evt) {
                    $scope.$apply(function($scope){
                        $scope.myImage=evt.target.result;
                        document.getElementById("formFile").reset();
                    });
                };
                reader.readAsDataURL(file);
            });

            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.ok = function() {
                $mdDialog.hide($scope.myCroppedImage);
            };
        }


    })
    .controller('perfilCtrl',function($scope){
        $scope.$parent.sideNavOpen = true;
        $scope.getEventos($scope.organizacion.idOrganizacion);
        $scope.getComentariosOng($scope.organizacion.idOrganizacion);


    })
    .controller('eventoStatCtrl',function($scope,$http,$log,$routeParams){
        $log.log($routeParams);
        $scope.getParticipantes($routeParams.id);

    });




