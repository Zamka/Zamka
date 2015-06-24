angular.module('ZamkaAdmin', ['ngMaterial','ngRoute'])
.config(function($mdThemingProvider,$routeProvider) {
  $routeProvider
	.when('/', {
    templateUrl: '/partials/admin/index.html',
    controller: 'indexCtrl'
  	})
  	.when('/estadisticas', {
    templateUrl: '/partials/admin/estadisticas.html',
    controller: 'estaCtrl'
  	})
  	.when('/eventos', {
    templateUrl: '/partials/admin/eventos.html',
    controller: 'eventosCtrl'
  	})
    .when('/perfil', {
    templateUrl: '/partials/admin/perfil.html',
    controller: 'perfilCtrl'
    })
  	.when('/evento/:id', {
    templateUrl: '/partials/admin/evento.html',
    controller: 'eventoCtrl'
  	})
    .when('/eventoStat/:id', {
    templateUrl: '/partials/admin/eventostat.html',
    controller: 'eventoStatCtrl'
    });	
  $mdThemingProvider.theme('default')
    .primaryPalette('pink')
    .accentPalette('grey');
})
.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
}])
.controller('indexCtrl', ['$scope','$mdToast','$timeout', function($scope,$mdToast,$timeout){
	$scope.lala = "lala";
	$timeout(function(){
		$mdToast.show(
	      $mdToast.simple()
	        .content('Por favor Ingrese con su cuenta de Zamka ONG')
	        .position('bottom')
	        .hideDelay(3000)
	    );
	},500,false);
    
}])
.controller('estaCtrl', ['$scope','$mdToast','$timeout', function($scope,$mdToast,$timeout){
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
   
}])
.controller('eventosCtrl', ['$scope','$timeout','$log', function($scope,$timeout,$log){
$scope.eventos = [
{nombre:"Evento 10",size:2,href:"/admin/#/evento/10"},
{nombre:"Evento 9",size:2,href:"/admin/#/evento/9"},
{nombre:"Evento 8",size:2,href:"/admin/#/evento/8"},
{nombre:"Evento 7",size:2,href:"/admin/#/evento/7"},
{nombre:"Evento 6",size:2,href:"/admin/#/evento/6"},
{nombre:"Evento 5",size:1,href:"/admin/#/evento/5"},
{nombre:"Evento 4",size:1,href:"/admin/#/evento/4"},
{nombre:"Evento 3",size:1,href:"/admin/#/evento/3"},
{nombre:"Evento 2",size:1,href:"/admin/#/evento/2"},
{nombre:"Evento 1",size:1,href:"/admin/#/evento/1"},
{nombre:"Evento x",size:1,href:"/admin/#/evento/x"}];
}])
.controller('eventoCtrl', ['$scope', '$routeParams','$log','$mdDialog', function($scope, $routeParams,$log,$mdDialog){
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

}])
.controller('perfilCtrl', ['$scope', function($scope){
  $scope.eventos = [
{nombre:"Evento 5",img:"/img/Picture5.jpg",href:"/admin/#/evento/5"},
{nombre:"Evento 4",img:"/img/Picture4.jpg",href:"/admin/#/evento/4"},
{nombre:"Evento 3",img:"/img/Picture3.jpg",href:"/admin/#/evento/3"},
{nombre:"Evento 2",img:"/img/Picture2.jpg",href:"/admin/#/evento/2"},
{nombre:"Evento 1",img:"/img/Picture1.jpg",href:"/admin/#/evento/1"}];

}])
.controller('eventoStatCtrl', ['$scope','$http','$log', function($scope,$http,$log){
$http.get('http://api.randomuser.me/?results=20&nat=es').success(function(data){
$scope.usuarios = data.results;
$log.log($scope.usuarios);
});
}]);;




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