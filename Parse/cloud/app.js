express = require('express');
expressLayouts = require('cloud/express-layouts');
app = express();

var user = require('cloud/routes/user');
var categorias = require('cloud/routes/categorias');
var eventos = require('cloud/routes/eventos');

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
//app.use(expressLayouts);
app.use(express.bodyParser());    // Middleware for reading request body

app.locals.parseApplicationId = 'YOUR_APP_ID';
app.locals.parseJavascriptKey = 'YOUR_JAVASCRIPT_KEY';
app.locals.facebookApplicationId = 'YOUR_FB_APP_ID';

app.locals._ = require('underscore');


//Login
app.post("/Login", user.login);
app.post("/Login", user.registro);

//Categorias
app.get("/Categorias", categorias.fetch);

//Eventos
app.get("/Buscar", eventos.buscar);
app.get("/EventosCat", eventos.porCategoria);
app.get("/Evento", eventos.evento);

//Organizacion
app.post("/Admin/Login", user.loginOrganizacion);
app.get("/Admin/Eventos", eventos.eventosONG);
app.post("/Admin/CrearEvento", eventos.crearEvento);
app.put("/Admin/Evento", eventos.editarEvento);


app.get('/App*', function (req, res) {
    res.render('user');
});
app.get('/Admin*', function (req, res) {
    res.render('admin');
});
app.get('/', function (req, res) {
    res.redirect('https://www.facebook.com/pages/Zamka/705880659483641');
});

app.listen();
