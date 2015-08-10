var Evento = Parse.Object.extend("Evento");
    var ONG = Parse.Object.extend("Organizacion");

exports.buscar = function (req, res) {
    var busqueda = req.query.busqueda;
    var query = new Parse.Query(Evento);
    query.limit(100);
    query.contains("Nombre", busqueda);
    query.descending('createdAt');
    query.find().then(function (eventos) {
        res.json(eventos);
    });
};

exports.porCategoria = function (req, res) {
    var categoria = req.query.categoria;
    var query = new Parse.Query(Evento);
    query.limit(100);
    query.descending('createdAt');
    query.find().then(function (eventos) {
        res.json(eventos);
    });
};

exports.evento = function (req, res) {
    var id = req.query.idEvento;
    var query = new Parse.Query(Evento);
    query.get(id, function (evento) {
        res.json(evento);
    });
};

exports.eventosONG = function (req, res) {
    var idONG = req.query.idONG;
    var query = new Parse.Query(Evento);
    var ong = new ONG();
    ong.id = idONG;

    query.equalTo("Organizacion", ong);
    query.find().then(function (eventos) {
        res.json(eventos);
    }, function (error) {
        res.json(error);
    });
};

exports.crearEvento = function (req, res) {
    //nombre,descripcion,contenido,cover,categorias,fotos,idONG
    var evento = new Evento();
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    var contenido = req.body.contenido;
    var cover = req.body.cover;
    var categorias = req.body.categorias;
    var fotos = req.body.fotos;
    var idONG = req.body.idONG;

    evento.set("Nombre", nombre);
    evento.set("Descripcion", descripcion);
    evento.set("Contenido", contenido);
    //evento.set("cover", cover);
    //evento.set("categorias", categorias);
    //evento.set("fotos", fotos);
    evento.set("idONG", idONG);
    evento.set("vistas", 0);

    evento.save(null, {
        success: function (evento) {
            res.json(evento);
        },
        error: function (evento, error) {
            res.json(error);
        }
    });


};
exports.editarEvento = function (req, res) {

    //nombre,descripcion,contenido,cover,categorias,fotos,idEvento
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    var contenido = req.body.contenido;
    var cover = req.body.cover;
    var categorias = req.body.categorias;
    var fotos = req.body.fotos;
    var idEvento = req.body.idEvento;

    var query = new Parse.Query(Evento);
    query.get(idEvento, {
        success: function (evento) {
            evento.set("nombre", nombre);
            evento.set("descripcion", descripcion);
            evento.set("contenido", contenido);
            //evento.set("cover", cover);
            //evento.set("categorias", categorias);
            //evento.set("fotos", fotos);

            evento.save(null, {
                success: function(evento) {
                    res.json(evento);
                }
            });

        },
        error: function (evento, error) {
            res.json(error);
        }
    });

};