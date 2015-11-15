
var express = require('express');
var expressLayouts = require('cloud/express-layouts');
var app = express();
var user = require('cloud/routes/user');
var categorias = require('cloud/routes/categorias');
var eventos = require('cloud/routes/eventos');
var participacion = require('cloud/routes/participacion');
var organizacion = require('cloud/routes/organizacion');
var imagenes = require('cloud/routes/imagenes');
var comentarios = require('cloud/routes/comentarios');

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
//app.use(expressLayouts);
app.use(express.limit('4mb'));

app.use(express.bodyParser({limit:4000000}));
app.use(express.json());
app.use(express.urlencoded());

app.locals.parseApplicationId = 'Cqnfkkzz1qHUkc200NnE4AQrDqe7pyT5F9YNTd9K';
app.locals.parseJavascriptKey = 'K4KL6bUdTljIuKE31QRfyGan9vMe8mcRMTnPbjVQ';
app.locals.facebookApplicationId = '974425189234287';

app.locals._ = require('underscore');

//Landing
app.post("/API/Inscripcion", user.inscripcion);

//Usuarios
app.post("/API/Login", user.login);
app.post("/API/Registrar", user.registro);

app.get("/API/Categorias", categorias.fetch);

app.get("/API/Buscar", eventos.buscar);
app.get("/API/EventosCat", eventos.porCategoria);
app.get("/API/Evento", eventos.evento);
app.get("/API/EventosSugeridos", eventos.sugeridos);

app.get("/API/Usuario", user.getUser);
app.put("/API/Usuario", user.updateUser);

app.post("/API/Participar", participacion.participar);
app.get("/API/SolicitudesUsuario", participacion.getParticipaciones);

app.get("/API/ComentariosOng",comentarios.comentariosOng);
app.post("/API/ComentarEvento",comentarios.comentarEvento);
app.post("/API/ComentarOrganizacion",comentarios.comentarOng);


//Organizacion
app.post("/API/Admin/Login", user.loginOrganizacion);

app.get("/API/Admin/Eventos", eventos.eventosONG);
app.post("/API/Admin/CrearEvento", eventos.crearEvento);
app.put("/API/Admin/Evento", eventos.editarEvento);
app.post("/API/Admin/BorrarEvento", eventos.borrarEvento);

app.get("/API/Admin/ONG", organizacion.getONG);
app.put("/API/Admin/ONG", organizacion.updateOrganizacion);

app.get("/API/Admin/Participantes",participacion.getParticipantes);
app.post("/API/Admin/AprobarParticipante",participacion.aprobarParticipante);
app.post("/API/Admin/RechazarParticipante",participacion.rechazarParticipante);

app.post("/API/Admin/SubirImagen",imagenes.addImagen);



app.get('/App*', function (req, res) {
    res.render('user');
});
app.get('/Admin*', function (req, res) {
    res.render('admin');
});
app.get('/', function (req, res) {
    res.render('index');
});

app.listen();
