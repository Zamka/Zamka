
// These two lines are required to initialize Express in Cloud Code.
 express = require('express');
 app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body


app.get('/App', function(req, res) {
  res.render('app');
});
app.get('/Admin', function(req, res) {
  res.render('admin');
});
app.get('/', function(req, res) {
  res.redirect('https://www.facebook.com/pages/Zamka/705880659483641');
});

app.listen();
