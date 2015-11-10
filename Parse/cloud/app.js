express = require('express');
expressLayouts = require('cloud/express-layouts');
app = express();

var user = require('cloud/routes/user');
var categorias = require('cloud/routes/categorias');
var eventos = require('cloud/routes/eventos');
var participacion = require('cloud/routes/participacion');
var organizacion = require('cloud/routes/organizacion');
var imagenes = require('cloud/routes/imagenes');

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
//app.use(expressLayouts);

app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());

app.locals.parseApplicationId = 'Cqnfkkzz1qHUkc200NnE4AQrDqe7pyT5F9YNTd9K';
app.locals.parseJavascriptKey = 'K4KL6bUdTljIuKE31QRfyGan9vMe8mcRMTnPbjVQ';
app.locals.facebookApplicationId = '974425189234287';

app.locals._ = require('underscore');

app.post("/API/Inscripcion", user.inscripcion);

//Login
app.post("/API/Login", user.login);
app.post("/API/Registrar", user.registro);

//Categorias
app.get("/API/Categorias", categorias.fetch);

//Eventos
app.get("/API/Buscar", eventos.buscar);
app.get("/API/EventosCat", eventos.porCategoria);
app.get("/API/Evento", eventos.evento);
app.get("/API/EventosSugeridos", eventos.sugeridos);

//de Usuario
app.get("/API/Usuario", user.getUser);
app.post("/API/Participar", participacion.participar);
app.get("/API/SolicitudesUsuario", participacion.getParticipaciones);


//Organizacion
app.post("/API/Admin/Login", user.loginOrganizacion);
app.get("/API/Admin/Eventos", eventos.eventosONG);
app.post("/API/Admin/CrearEvento", eventos.crearEvento);
app.put("/API/Admin/Evento", eventos.editarEvento);

app.get("/API/Admin/ONG", organizacion.getONG);

//Imagenes

app.get("/API/Admin/Imagenes",imagenes.getImagenes);
app.post("/API/Admin/Imagenes",imagenes.addImagen);
app.delete("/API/Admin/Imagenes",imagenes.delete);



app.get('/App*', function (req, res) {
    res.render('user');
});
app.get('/Admin*', function (req, res) {
    res.render('admin');
});
app.get('/', function (req, res) {
    res.render('index');
    //res.redirect('https://www.facebook.com/pages/Zamka/705880659483641');
});

app.listen();
