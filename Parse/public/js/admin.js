console.realWarn = console.warn;
console.warn = function (message) {
    if (message.indexOf("ARIA") == -1) {
        console.realWarn.apply(console, arguments);
    }
};
//GRID list compatibility MOz

var timenow = Date.now();
angular.module('ZamkaAdmin', ['ngMaterial','ngRoute','ngStorage','ngMessages','ngImgCrop'])
    .config(function($mdThemingProvider,$routeProvider,$interpolateProvider,$locationProvider) {
        $routeProvider.caseInsensitiveMatch = true;
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
            .when('/Admin/EditarOrganizacion', {
                templateUrl: '/partials/admin/editarOrganizacion.html',
                controller: 'editarOrganizacionCtrl'
            })
            .when('/Admin/EditarEvento/:id', {
                templateUrl: '/partials/admin/editarEvento.html',
                controller: 'editarEventoCtrl'
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
    .controller('AppCtrl',function($scope, $mdSidenav,$http,$log,$location,$localStorage,$mdToast,$timeout){
        $scope.fixGrids = function(){
            $timeout(function(){
                var grids =document.getElementsByTagName("md-grid-list");
                for(var key in grids){
                    try {
                        var grid = grids[key];
                        var newHeight = grid.scrollHeight;
                        grid.style.height = newHeight + "px";
                    }catch(e){}
                }
            },1000);

        };
        window.onresize = function(){
            $scope.fixGrids();
        };


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
        $scope.login = function(usuario,password,noGo){
            $scope.cargando = true;
            $http.post("/API/Admin/Login",{usuario:usuario,password:password})
                .success(function(data){
                    $scope.cargando = false;
                    $log.log(data);
                    $scope.organizacion = data;
                    $scope.organizacion.usuario = usuario;
                    $scope.organizacion.password = password;
                    $localStorage.organizacion = $scope.organizacion;
                    if(noGo){

                    }else{
                        $location.url("/Admin/Eventos");
                    }

                })
                .error(function(error){
                    $scope.cargando =false;
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
            $scope.cargando =true;
            $http.get("/API/ComentariosOng?idONG="+idONG)
                .success(function(data){

                    $scope.eventos = [];
                    $scope.cargando =false;
                    $log.log(data);
                    $scope.organizacion.comentarios = data;
                })
                .error(function(error){
                    $scope.cargando =false;
                    $log.log(error)
                });
        };
        $scope.subirFoto = function(foto,idONG,callback){
            $log.log(foto);
            $scope.cargando =true;
            $http.post("/API/Admin/SubirImagen",{
                imagen:{base64:foto},
                idONG:idONG
            }).success(function(data){
                $scope.cargando =false;
                $log.log(data);
                callback(data);
            })
                .error(function(error){
                    $log.log(error);
                    $scope.cargando =false;
                    callback();
                });
        };
        $scope.crearEvento = function(nombre,descripcion,fecha,contenido,foto,categorias,fotos){
            $scope.cargando =true;
            $http.post("/API/Admin/CrearEvento",{
                nombre:nombre,
                descripcion:descripcion,
                contenido:contenido,
                fecha:fecha,
                categorias:categorias,
                foto:foto,
                fotos:fotos,
                idONG:$scope.organizacion.objectId
            })
                .success(function(data){
                    $scope.cargando =false;
                    $log.log(data);
                    $location.url("/Admin/Eventos");
                })
                .error(function(error){
                    $scope.cargando =false;
                    $log.log(error);
                });
        };
        $scope.editarEvento = function(nombre,descripcion,fecha,contenido,foto,categorias,fotos,idEvento){
            $log.log(fotos);
            $scope.cargando =true;
            $http.put("/API/Admin/Evento",{
                nombre:nombre,
                descripcion:descripcion,
                fecha:fecha,
                contenido:contenido,
                foto:foto,
                categorias:categorias,
                fotos:fotos,
                idEvento:idEvento
            })
                .success(function(data){
                    $log.log("respuesta",data);
                    $scope.cargando =false;
                    $scope.scrollTop();
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Se Guardaron sus cambios con exito')
                            .position('top')
                            .hideDelay(3000)
                    );
                })
                .error(function(error){
                    $log.log(error);
                    $scope.cargando =false;
                    $scope.scrollTop();
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Ocurrio un error Guardando los cambios de su Evento, por favor intente denuevo')
                            .position('top')
                            .hideDelay(3000)
                    );
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
        };

        $scope.getParticipantes = function(idEvento){
            $log.log("getParticipantes");
            $scope.participantes = {
                pendientes:[],
                aprobados:[],
                rechazados:[]
            };
            $scope.cargando =true;
            $http.get("/API/Admin/Participantes?idEvento="+idEvento).success(function(data){
                $scope.cargando =false;
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
                $scope.cargando =false;
                $log.log(err);
            });
        };

        $scope.aprobarParticipante = function(idParticipacion){
            $scope.cargando =true;
            $http.post("/API/Admin/AprobarParticipante",{idParticipacion:idParticipacion}).success(function(data){
                $scope.cargando =false;
                $log.log(data);
                for(key in $scope.participantes.pendientes){
                    if ($scope.participantes.pendientes[key].idPeticion == idParticipacion){
                        $scope.participantes.aprobados.push($scope.participantes.pendientes[key]);
                        $scope.participantes.pendientes.splice(key,1);

                    }
                }
            }).error(function(err){
                $scope.cargando =false;
                $log.log(err);
            });
        };
        $scope.rechazarParticipante = function(idParticipacion){
            $scope.cargando =true;
            $http.post("/API/Admin/RechazarParticipante",{idParticipacion:idParticipacion}).success(function(data){
                $scope.cargando =false;
                $log.log(data);
                for(key in $scope.participantes.pendientes){
                    if ($scope.participantes.pendientes[key].idPeticion == idParticipacion){
                        $scope.participantes.rechazados.push($scope.participantes.pendientes[key]);
                        $scope.participantes.pendientes.splice(key,1);
                    }
                }
            }).error(function(err){
                $scope.cargando =false;
                $log.log(err);
            });
        };
        $scope.borrarEvento = function(idEvento){
            swal({
                title: "¿Estas Seguro?",
                text: "Estas a punto de borrar este evento. Si lo haces, no podras recuperarlo",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si, Borrar",
                closeOnConfirm: false
            }, function(){
                $scope.cargando =true;
                $http.post("/API/Admin/BorrarEvento",{idEvento:idEvento}).success(function(){
                    $scope.cargando =false;
                    swal("Evento Borrado", "Este evento fue borrado con exito", "success");
                    $scope.getEventos($scope.organizacion.idOrganizacion);
                }).error(function(error){
                    $log.error(error);
                    $scope.cargando =false;
                });

            });
        }
        $scope.editarOrganizacion = function(nombre,descripcion,resumen,newFoto){
            $scope.cargando = true;
            $http.put("/API/Admin/ONG",{
                idONG:$scope.organizacion.idOrganizacion,
                nombre:nombre,
                descripcion:descripcion,
                resumen:resumen,
                newFoto:newFoto
            }).success(function(data){
                $scope.organizacion.Contenido = data.Contenido;
                $scope.organizacion.Descripcion = data.Descripcion;
                $scope.organizacion.Nombre = data.Nombre;
                $scope.organizacion.Foto = data.Foto.url;
                $localStorage.organizacion = $scope.organizacion;
                $log.log("respuesta",data);
                $scope.cargando = false;
                $scope.scrollTop();
                $mdToast.show(
                    $mdToast.simple()
                        .content('Cambios Efectuados con exito')
                        .position('top')
                        .hideDelay(3000)
                );

                $location.url("/Admin/Eventos");

            }).error(function(error){ $scope.cargando = false;
                $log.error(error);
                $mdToast.show(
                    $mdToast.simple()
                        .content('Ocurrio un error, por favor intenta denuevo')
                        .position('top')
                        .hideDelay(3000)
                );

            });

        }

        // UTILITIES

        $scope.showDate = function(iso){
            return moment(iso).format("Do MMM YYYY");
        };
        $scope.timeSince = function(iso){
            return moment(iso).fromNow();
        };
        $scope.goTo = function(sitio){
            $location.url(sitio);
        };
        $scope.stagger = function(i){
            return {
                '-webkit-animation-delay': (i*0.05)+'s',
                'animation-delay': (i*0.05)+'s'
            }
        }
        $scope.scrollTop = function(){
            $("html, body").animate({ scrollTop: 0 }, "slow");
        };
    })
    .controller('indexCtrl',function($scope,$mdToast,$timeout){
        $scope.fixGrids();
        $scope.lala = "lala";
        $timeout(function(){

            $scope.scrollTop();
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
    .controller('editarOrganizacionCtrl',function($scope,$timeout,$log,$mdDialog){
        $scope.login($scope.organizacion.usuario,$scope.organizacion.password,true);

        $scope.getCategorias();
        $scope.loadImage = function(){
            $timeout(function(){
                $log.log(document.getElementById("fileInput"));
                document.getElementById("fileInput").click();},500);
            $scope.showAdvanced();
        };
        $log.log($scope.organizacion);
        $scope.ong = {
            nombre:$scope.organizacion.Nombre,
            logo:$scope.organizacion.Foto,
            descripcion:$scope.organizacion.Descripcion,
            contenido:$scope.organizacion.Contenido,
            categoria:$scope.organizacion.Categorias[0]
        };
        $scope.getBg = function(){
            return {
                'background-image':'url(' + $scope.ong.logo + ')'
            }
        };

        $scope.guardar = function(){
            $scope.editarOrganizacion($scope.ong.nombre,
                $scope.ong.descripcion,
                $scope.ong.contenido,
                $scope.newFoto);

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
                    $log.log(answer);
                    $scope.newFoto=answer.substr(22,answer.length);
                    $scope.ong.logo=answer;
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
    .controller('crearEventoCtrl',function($scope, $routeParams,$log,$mdDialog,$timeout,$mdToast){
        $scope.fixGrids();
        $scope.getCategorias();
        $scope.minDate = new Date();
        $scope.evento={};
        $scope.loadingFoto = false;
        $scope.evento.fotos=[];
        $scope.showCropped = function(){
            $scope.evento.fotos.push($scope.myCroppedImage);
            $log.log($scope.myCroppedImage);
        }

        $scope.fistFoto = function(){
            if($scope.evento.fotos[0] == undefined){
                return "http://mave.me/img/projects/full_placeholder.png";
            }else{
                return $scope.evento.fotos[0].Archivo.url;
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
        $scope.removeFoto = function(index){
            $scope.evento.fotos.splice(index,1);
        }
        $scope.showAdvanced = function(ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: '/partials/admin/templates/subirFoto.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
                .then(function (answer) {
                    $scope.loadingFoto = true;
                    $scope.subirFoto(answer,$scope.myCroppedImage,function(foto){
                        if(foto){
                            $scope.evento.fotos.push(foto);
                        }else{

                            $scope.scrollTop();
                            $mdToast.show(
                                $mdToast.simple()
                                    .content('Ocurrio un error subiendo su foto, por favor intente denuevo')
                                    .position('top')
                                    .hideDelay(3000)
                            );
                        }
                        $scope.loadingFoto = false;
                    });
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        };
        $scope.guardar = function(){
            $scope.crearEvento(
                $scope.evento.nombre,
                $scope.evento.descripcion,
                $scope.evento.fecha,
                $scope.evento.contenido,
                $scope.evento.fotos[0],
                [$scope.categoria],
                $scope.evento.fotos);
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
    .controller('editarEventoCtrl',function($scope, $routeParams,$log,$mdDialog,$timeout,$http,$mdToast,$window){
        $scope.fixGrids();
        $scope.getCategorias();
        $scope.evento={};
        $scope.loadingFoto = false;
        $scope.getEvento = function(id){
            $http.get("/API/Evento?idEvento="+id).success(function(data){
                $log.log("data:",data);
                $scope.evento={
                    id:id,
                    categoria:data.Categorias[0],
                    contenido:data.Contenido,
                    descripcion:data.Descripcion,
                    fecha:new Date(data.Fecha),
                    nombre:data.Nombre,
                    foto:data.Imagen["_url"],
                    comentarios:[],
                    fotos: [],
                    org:{
                        nombre:data.Organizacion.Nombre,
                        id:data.Organizacion.objectId,
                        foto:data.Organizacion.foto["_url"]
                    }
                };
                for(key in data.Fotos){
                    $scope.evento.fotos.push(data.Fotos[key]);
                }
                $log.log("Evento:",$scope.evento);
                $scope.categoria=$scope.evento.categoria;
            });
        };

        $scope.getEvento($routeParams.id);

        $scope.evento.fotos=[];
        $scope.showCropped = function(){
            $scope.evento.fotos.push($scope.myCroppedImage);
            $log.log($scope.myCroppedImage);
        }
        $scope.guardar = function(){
            $scope.editarEvento(
                $scope.evento.nombre,
                $scope.evento.descripcion,
                $scope.evento.fecha,
                $scope.evento.contenido,
                $scope.evento.fotos[0],
                [$scope.categoria],
                $scope.evento.fotos,
                $scope.evento.id);
        };

        $scope.fistFoto = function(){
            if($scope.evento.fotos[0] == undefined){
                return "http://mave.me/img/projects/full_placeholder.png";
            }else{
                return $scope.evento.fotos[0].Archivo.url;
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
        $scope.removeFoto = function(index){
            $scope.evento.fotos.splice(index,1);
        }
        $scope.showAdvanced = function(ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: '/partials/admin/templates/subirFoto.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
                .then(function (answer) {
                    $scope.loadingFoto = true;
                    $scope.subirFoto(answer,$scope.myCroppedImage,function(foto){
                        if(foto){
                            $scope.evento.fotos.push(foto);
                        }else{

                            $scope.scrollTop();
                            $mdToast.show(
                                $mdToast.simple()
                                    .content('Ocurrio un error subiendo su foto, por favor intente denuevo')
                                    .position('top')
                                    .hideDelay(3000)
                            );
                        }
                        $scope.loadingFoto = false;
                    });
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
        $scope.fixGrids();
        $scope.$parent.sideNavOpen = true;
        $scope.getEventos($scope.organizacion.idOrganizacion);
        $scope.getComentariosOng($scope.organizacion.idOrganizacion);


    })
    .controller('eventoStatCtrl',function($scope,$http,$log,$routeParams){
        $scope.fixGrids();
        $log.log($routeParams);
        $scope.getParticipantes($routeParams.id);

    });




