var timenow=Date.now();
moment.locale('es');
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


window.fbAsyncInit = function() {
    FB.init({
        appId      : '974425189234287',
        cookie     : true,  // enable cookies to allow the server to access
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.2' // use version 2.2
    });
}
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
      .when('/App/Categoria/:cat', {
          templateUrl: '/partials/app/eventos.html',
          controller: 'categoriaCtrl'
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
          controller: 'peticionesCtrl'
      });
  $mdThemingProvider.theme('default');
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
})
.controller('AppCtrl', function($scope,$timeout,$location,$http,$log,$mdToast){
    $scope.cargando = false;
    //CheckLogin
    if(localStorage.usuario){
        $scope.usuario = JSON.parse(localStorage.usuario);
    }

    $scope.irEvento = function(id){
        $location.url("/App/Evento/"+id);
    };
    ///FB LOGIN
    $scope.loginFB = function(){
        $scope.cargando = true;
        $http.post("/API/Login",{
            correo:"test@zamka.org",
            password:null,
            fbid:511882046
        }).success(function(data){
            $scope.cargando = false;
            $log.log("--SUCCESS--");
            $log.log("data:",data);
        });
    };

    //Login FB
    function statusChangeCallback(response) {
        console.log('statusChangeCallback');
        console.log(response);
    };

    $scope.loginfb = function(){
        FB.getLoginStatus(function(response){
            if (response.status === 'connected') {
                $scope.login(response.email,null,FB.getAccessToken());
            }
            else {
                FB.login(function(response){
                    $scope.login(response.email,null,FB.getAccessToken());
                }, {scope: 'email'});
            }
        });
    }

    // LOGIN
    $scope.login = function(correo,password,fbid){
        $scope.cargando = true;
        $http.post("/API/Login",{
            correo:correo,
            password:password,
            fbid:fbid
        }).success(function(data){
            $scope.cargando = false;
            $log.log("--SUCCESS--");
            $log.log("data:",data);
            $scope.usuario = {
                email:data.email,
                fbid:data.facebookID,
                foto:data.image.url,
                nombre:data.name,
                id:data.objectId
            };
            localStorage.usuario = JSON.stringify($scope.usuario);

            if (data.objectId){
                $location.url("/App/Eventos");
            }
        }).error(function(data){
            $scope.cargando = false;
            $log.log("--Error--");
            $log.log("data:",data);
        });
    };
    //LOGOUT
    $scope.logout = function(){
        localStorage.usuario = null;
        $scope.usuario = null;
        FB.logout();
        $location.url("/App");
    }
    //CATEGORIAS
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
    ///EVENTOS
    $scope.getEventos = function(){
        $scope.cargando = true;
        $scope.eventos = [];
        $http.get("/API/Buscar?busqueda=").success(function(data){
            $log.log(data);
            for (key in data){
                var evento = data[key];
                $scope.eventos.push({
                    descripcion:evento.descripcion,
                    fecha:new Date(evento.fecha),
                    nombre:evento.nombre,
                    foto:evento.foto,
                    id:evento.id
                });
            }
            $scope.cargando = false;
            $log.log("Eventos:",$scope.eventos);
        });
    };
    ///EVENTOS CATEGORTIA
    $scope.getEventosCat = function(cat){
        $scope.cargando = true;
        $scope.eventos = [];
        $http.get("/API/EventosCat?categoria="+cat).success(function(data){
            for (key in data){
                var evento = data[key];
                $scope.eventos.push({
                    descripcion:evento.descripcion,
                    fecha:evento.fecha,
                    nombre:evento.nombre,
                    foto:evento.foto,
                    id:evento.id
                });
            }
            $scope.cargando = false;
            $log.log("Eventos:",$scope.eventos);
        });
    };
    //EVENTO
    $scope.getEvento = function(id){
        $scope.cargando = true;
        $scope.evento={};
        $http.get("/API/Evento?idEvento="+id).success(function(data){

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
                    foto:data.Organizacion.foto["_url"]
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
            $scope.cargando = false;
            $log.log("Evento:",$scope.evento);
        });
    };
    //SOLICITAR PARTICIPACION
    $scope.solicitarParticipacion = function(idEvento,idUsuario){
        $scope.cargando = true;
        $http.post("/API/Participar",{
            idEvento:idEvento,
            idUsuario:idUsuario
        }).success(function(data){
            $log.log(data);
            $scope.cargando = false;
            swal(
                {
                    title:"Exito!",
                    text:"Registramos tu peticion para participar, por favor este atento a su confirmacion.",
                    type:"success",
                    confirmButtonColor: "#009688"
                });
        }).error(function(error){
            $log.error(error);
        });

    }
    //PERFIL
    $scope.getUsuario = function(id){
        $scope.perfil={};
        $scope.cargando = true;
        $http.get("/API/Usuario?idUsuario="+id)
            .success(function(data){
            $scope.cargando = false;
            $log.log("PerfilData:",data);
            $scope.perfil={
                nombre:data.Nombre,
                foto:data.Foto["_url"],
                gustos:data.Gustos,
                participaciones:data.listaParticipacion
            };
        });
    }
    //ONG
    $scope.getOng = function(id){
        $scope.ong={};
        $scope.cargando = true;
        $http.get("/API/Admin/ONG?idONG="+id)
            .success(function(data){
                $scope.cargando = false;
                $log.log("ONG Data:",data);
                $scope.ong={
                    nombre:data.Nombre,
                    foto:data.Imagen["_url"],
                    descripcion:data.Descripcion,
                    eventos:[],
                    comentarios:[]
                };
                for(key in data.Comentarios){
                    $scope.ong.comentarios.push({
                        comentario:data.Comentarios[key].Comentario,
                        fecha:data.Comentarios[key].Fecha,
                        usuario:{
                            nombre:data.Comentarios[key].Nombre,
                            id:data.Comentarios[key].idUsuario,
                            foto:data.Comentarios[key].Foto["_url"]
                        }
                    });
                }
                for(key in data.listaEventos){
                    $scope.ong.eventos.push({
                        nombre:data.listaEventos[key].nombre,
                        descripcion:data.listaEventos[key].descripcion,
                        foto:data.listaEventos[key].foto,
                        fecha:new Date(data.listaEventos[key].fecha),
                        id:data.listaEventos[key].id,
                        categoria:data.listaEventos[key].categoria
                    });
                }
                $log.log("ONG:",$scope.ong);
            });
    }
    //Peticiones
    $scope.getPeticiones = function(){
        $scope.cargando = true;
        $scope.peticiones = [];

        $log.log("/API/SolicitudesUsuario?idUsuario="+$scope.usuario.id);
        $http.get("/API/SolicitudesUsuario?idUsuario="+$scope.usuario.id)
            .success(function(data){
                $log.log("peticionesData",data);
                $scope.cargando = false;
                for(key in data){
                    $scope.peticiones.push({
                       estado:data[key].estado,
                        evento:{
                            nombre:data[key].evento.Nombre,
                            descripcion:data[key].evento.Descripcion,
                            foto:data[key].evento.Imagen.url,
                            fecha:data[key].evento.Fecha.iso,
                            id:data[key].evento.objectId,
                            categoria:data[key].evento.Categorias[0]
                        }
                    });
                }
                $log.log("Peticiones:",$scope.peticiones);
                localStorage.peticiones = JSON.stringify($scope.peticiones);
            });
    }
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
    $scope.toastPosition = {
        bottom: false,
        top: true,
        left: false,
        right: true
    };
    $scope.getToastPosition = function() {
        return Object.keys($scope.toastPosition)
            .filter(function(pos) { return $scope.toastPosition[pos]; })
            .join(' ');
    };
    $scope.showToast = function(txt) {
        $scope.scrollTop();
        $mdToast.show(
            $mdToast.simple()
                .content(txt)
                .position($scope.getToastPosition())
                .hideDelay(3000)
        );
    };
    $scope.searchCategoria = function(cat){
        $location.url("/App/Categoria/"+cat);
    };
    $scope.listaUno=function(arr){
        return arr[0];
    }
    $scope.getEstado = function(a){
        switch (a){
            case -1:
                return "fa-times-circle-o estado-rechazado";
            case 0:
                return "fa-clock-o estado-pendiente";
            case 1:
                return "fa-check-circle-o estado-aprobado";
        }
    }
    $scope.goToMiCuenta = function(){
        $location.url("/App/MiCuenta");
    }
    $scope.goToMiPerfil = function(){
        $location.url("/App/Perfil/"+$scope.usuario.id);
    }
    $scope.scrollTop = function(){
        $("html, body").animate({ scrollTop: 0 }, "slow");
    };
})
.controller('indexCtrl',function($scope,$timeout,$location){
    $timeout(function(){
        if($scope.usuario){
            $location.url("/App/Eventos");
        }else{
            $location.url("/App/Login");
        }
    },1000,true);

})
.controller('loginCtrl',function($scope,$timeout,$location){

})
.controller('signupCtrl',function($http,$scope,$log,$location){
    //SIGNUP
        $scope.user = {email:"",nombre:"",email:"",password:"",password2:""};
        $scope.data= {cb1:false};
    $scope.register = function(){
        var correo = $scope.user.email;
        var nombre = $scope.user.nombre;
        var password = $scope.user.password;
        var password2 = $scope.user.password2;
        if(!$scope.data.cb1){
            swal({
                title:"Error!",
                text:"Debe aceptar los terminos y condiciones para registrar una cuenta en Zamka",
                type:"warning",
                confirmButtonColor: "#009688"
            });
        }else{
            if(password == password2){
                $http.post("/API/Registrar",{
                    correo:correo,
                    password:password,
                    nombre:nombre
                }).success(function(data){
                    $log.log("Registro",data);
                    if(data.code == -1){
                        swal({
                            title:"Error!",
                            text:"Debe Ingresar una contraseña",
                            type:"warning",
                            confirmButtonColor: "#009688"
                        });
                    }else if(data.code == 202){
                        swal({
                            title:"Error!",
                            text:"Ya existe una cuenta con ese correo.",
                            type:"warning",
                            confirmButtonColor: "#009688"
                        });
                    }else if(data.objectId && data.code == undefined){
                        $location.url("/App/Eventos");
                    }
                });
            }else{
                swal({
                        title:"Error!",
                        text:"Verifique su contraseña",
                        type:"warning",
                        confirmButtonColor: "#009688"
                    });
            }
        }


    }

})
.controller('eventosCtrl',function($scope,$timeout,$location){
    $scope.scrollTop();
    $scope.getCategorias();
    $scope.getEventos();
})
.controller('categoriaCtrl',function($scope,$timeout,$location,$routeParams){
    $scope.scrollTop();
    $scope.getCategorias();
    $scope.getEventosCat($routeParams.cat);
})
.controller('eventoCtrl',function($scope,$timeout,$location,$routeParams){
    $scope.scrollTop();
    $scope.getEvento($routeParams.id);
    $scope.confirmarParticipacion = function(){
        swal({
                title: "Estas Seguro?",
                text: "Si aceptas participar en este evento es un compromiso con esta organizacion y deberas cumplir en asistir al evento",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#009688",
                confirmButtonText: "Si,Deseo Participar!",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false },
            function(){
                $scope.solicitarParticipacion($routeParams.id,$scope.usuario.id);
            });
    };
})
.controller('peticionesCtrl',function($scope,$timeout,$location,$routeParams){
    $scope.scrollTop();
    $scope.getPeticiones();
})
.controller('perfilCtrl',function($scope,$timeout,$location,$routeParams){
    $scope.scrollTop();
    $scope.getUsuario($routeParams.id);
})
.controller('ongCtrl',function($scope,$timeout,$routeParams){
    $scope.scrollTop();
    $scope.getOng($routeParams.id);
});