var Evento = Parse.Object.extend("Evento");
var ONG = Parse.Object.extend("Organizacion");
var Imagen = Parse.Object.extend("Imagenes");
var ComentarioEvento = Parse.Object.extend("ComentarioEvento");

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
    query.equalTo("Categorias", categoria);
    query.find().then(function (eventos) {
        res.json(eventos);
    });
};

exports.evento = function (req, res) {
    var id = req.query.idEvento;
    var query = new Parse.Query(Evento);
    var query2 = new Parse.Query(ComentarioEvento);
    query.include("Organizacion");
    query.include("Imagen");
    query.include("Fotos");
    query2.select("Comentario", "Usuario");
    query2.include("Usuario");
    var respuesta = {};
    var comentariosrespuesta = [];
    query.get(id, function (evento) {
        query2.equalTo("Evento", evento);
        query2.find().then(function (comentarios) {
            var i = 0;
            comentarios.forEach(function (comentario) {
                comentariosrespuesta[i] = {};
                comentariosrespuesta[i].idUsuario = comentario.get("Usuario").id;
                comentariosrespuesta[i].Nombre = comentario.get("Usuario").get("name");
                comentariosrespuesta[i].Foto = comentario.get("Usuario").get("image");
                comentariosrespuesta[i].Fecha = comentario.createdAt;
                comentariosrespuesta[i++].Comentario = comentario.get("Comentario");
            });
            respuesta.Comentarios = comentariosrespuesta;
            respuesta.Nombre = evento.get("Nombre");
            respuesta.Descripcion = evento.get("Descripcion");
            respuesta.Contenido = evento.get("Contenido");
            respuesta.Categorias = evento.get("Categorias");
            respuesta.Fecha = evento.createdAt;
            respuesta.Organizacion = evento.get("Organizacion");
            respuesta.Imagen = evento.get("Imagen");
            var relation = evento.relation("Fotos");
            var query3 = relation.query();
            query3.find({
                success: function (fotos) {
                    respuesta.Fotos = fotos;
                    res.json(respuesta);
                },
                error: function (error) {
                    res.json(error);
                }
            });

        }, function (error) {
            res.json(error);
        });
    });
};

exports.sugeridos = function (req, res) {
    var busqueda = req.query.busqueda;
    var query = new Parse.Query(Evento);
    query.limit(100);
    query.contains("Nombre", busqueda);
    query.descending('createdAt');
    query.find().then(function (eventos) {
        res.json(eventos);
    });
};

exports.eventosONG = function (req, res) {
    var idONG = req.query.idONG;
    var query = new Parse.Query(Evento);
    var ong = new ONG();
    ong.id = idONG;

    query.equalTo("Organizacion", ong);
    query.include("Imagen");
    query.find().then(function (eventos) {
        var eventosFormatted = [];
        for (var key in eventos){
            console.log(eventos[key]);
            eventosFormatted.push({
                id:eventos[key].id,
                nombre:eventos[key].get("Nombre"),
                descripcion:eventos[key].get("Descripcion"),
                foto:eventos[key].get("Imagen").get("Archivo")["_url"],
                fecha:eventos[key].get("Fecha")
            });
        }
        console.log(eventosFormatted);
        res.json(eventosFormatted);
    }, function (error) {
        res.json(error);
    });
};

exports.crearEvento = function (req, res) {

    var evento = new Evento();
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    var contenido = req.body.contenido;
    var categorias = req.body.categorias;
    var foto = req.body.foto;
    var fotos = req.body.fotos;
    var idONG = req.body.idONG;
    var ong = new ONG();
    ong.id = idONG;
    evento.set("Organizacion", ong);
    evento.set("Nombre", nombre);
    evento.set("Descripcion", descripcion);
    evento.set("Contenido", contenido);
    evento.set("Categorias", categorias);

    evento.set("Vistas", 0);

    var imagen = new Imagen();
    imagen.id = foto;
    evento.set("Imagen", imagen);
    var fotosR = evento.relation("Fotos");
    for(var fotoKey in fotos){
        var imagen = new Imagen();
        imagen.id = fotos[fotoKey];
        fotosR.add(imagen);
    }
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
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    var contenido = req.body.contenido;
    var categorias = req.body.categorias;
    var foto = req.body.foto;
    var fotos = req.body.fotos;
    var query = new Parse.Query(Evento);
    query.get(idEvento, {
        success: function (evento) {
            if(nombre)
                evento.set("Nombre", nombre);
            if(descripcion)
                evento.set("Descripcion", descripcion);
            if(contenido)
                evento.set("Contenido", contenido);
            if(categorias)
                evento.set("categorias", categorias);
            if(fotos)
                evento.set("fotos", fotos);
            if(foto)
                evento.set("Imagen", foto);
            evento.save(null, {
                success: function (evento) {
                    res.json(evento);
                },
                error: function (evento, error) {
                    res.json(error);
                }
            });
        },
        error: function (evento, error) {
            res.json(error);
        }
    });
};