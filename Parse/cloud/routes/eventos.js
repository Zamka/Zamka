var Evento = Parse.Object.extend("Evento");
var ONG = Parse.Object.extend("Organizacion");
var Imagen = Parse.Object.extend("Imagenes");
var ComentarioEvento = Parse.Object.extend("ComentarioEvento");
var Participacion = Parse.Object.extend("Participacion");

exports.buscar = function (req, res) {
    var busqueda = req.query.busqueda;
    var query = new Parse.Query(Evento);
    query.limit(100);
    query.include("Imagen");
    query.contains("Nombre", busqueda);
    query.descending('Fecha');
    var todaysDate = new Date();
    query.greaterThanOrEqualTo( "Fecha", todaysDate );
    query.find().then(function (eventos) {
        var eventosFormatted = [];
        for (var key in eventos){
            console.log(eventos[key].get("Imagen").get("Archivo")["_url"]);
            eventosFormatted.push({
                id:eventos[key].id,
                nombre:eventos[key].get("Nombre"),
                descripcion:eventos[key].get("Descripcion"),
                foto:eventos[key].get("Imagen").get("Archivo")["_url"],
                fecha:eventos[key].get("Fecha"),
                categoria:eventos[key].get("Categorias")[0]
            });
        }
        console.log(eventosFormatted);
        res.json(eventosFormatted);
    });
};

exports.porCategoria = function (req, res) {
    var categoria = req.query.categoria;
    var query = new Parse.Query(Evento);
    query.limit(100);
    query.include("Imagen");
    query.descending('createdAt');
    var todaysDate = new Date();
    query.greaterThanOrEqualTo( "Fecha", todaysDate );
    query.equalTo("Categorias", categoria);
    query.find().then(function (eventos) {
        var eventosFormatted = [];
        for (var key in eventos){
            console.log(eventos[key].get("Imagen").get("Archivo")["_url"]);
            eventosFormatted.push({
                id:eventos[key].id,
                nombre:eventos[key].get("Nombre"),
                descripcion:eventos[key].get("Descripcion"),
                foto:eventos[key].get("Imagen").get("Archivo")["_url"],
                fecha:eventos[key].get("Fecha"),
                categoria:eventos[key].get("Categorias")[0]
            });
        }
        console.log(eventosFormatted);
        res.json(eventosFormatted);
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
                fecha:eventos[key].get("Fecha"),
                categoria:eventos[key].get("Categorias")[0]
            });
        }
        console.log(eventosFormatted);
        res.json(eventosFormatted);
    }, function (error) {
        res.json(error);
    });
};

exports.evento = function (req, res,next) {
    var id = req.query.idEvento;
    var query = new Parse.Query(Evento);
    var query2 = new Parse.Query(ComentarioEvento);
    query.include("Organizacion");
    query.include("Imagen");
    query2.select("Comentario", "Usuario");
    query2.include("Usuario");
    var respuesta = {};
    var comentariosrespuesta = [];
    query.get(id).then(function (data) {
        if(data){
            respuesta.Nombre = data.get("Nombre");
            respuesta.Descripcion = data.get("Descripcion");
            respuesta.Contenido = data.get("Contenido");
            respuesta.Categorias = data.get("Categorias");
            respuesta.Fecha = data.get("Fecha");
            respuesta.Organizacion = {
                Nombre:data.get("Organizacion").get("Nombre"),
                objectId:data.get("Organizacion").id,
                foto:data.get("Organizacion").get("Foto")
            };
            respuesta.Imagen = data.get("Imagen");
            var relation = data.relation("Fotos");
            query2.equalTo("Evento", data);
            query2.descending('createdAt');
            query2.find().then(function (comentarios) {
                for(var key in comentarios){
                    var comentario = comentarios[key];
                    comentariosrespuesta[key] = {};
                    comentariosrespuesta[key].Fecha = comentario.createdAt;
                    comentariosrespuesta[key].idUsuario = comentario.get("Usuario").id;
                    comentariosrespuesta[key].Nombre = comentario.get("Usuario").get("name");
                    comentariosrespuesta[key].Foto = comentario.get("Usuario").get("image");
                    comentariosrespuesta[key].Comentario = comentario.get("Comentario");
                }

                respuesta.Comentarios = comentariosrespuesta;
                var query3 = relation.query();
                query3.find({
                    success: function (fotos) {
                        respuesta.Fotos = fotos;
                        res.json(respuesta);
                    },
                    error: function (error) {
                        return next({error:error});
                    }
                });
            }, function (error) {
                return next({error:error});
            });


        }else{
            return next({error:"evento not found"});
        }
    },function(error){
        return next({error:error});
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



exports.crearEvento = function (req, res) {

    var evento = new Evento();
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    var contenido = req.body.contenido;
    var categorias = req.body.categorias;
    var fecha = req.body.fecha;
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
    evento.set("Fecha",new Date(fecha));

    evento.set("Vistas", 0);

    var imagen = new Imagen();
    imagen.id = foto.objectId;
    evento.set("Imagen", imagen);
    var fotosR = evento.relation("Fotos");
    for(var fotoKey in fotos){
        var imagen = new Imagen();
        imagen.id = fotos[fotoKey].objectId;
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
    var fecha = req.body.fecha;
    var fotos = req.body.fotos;
    var idEvento = req.body.idEvento;
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
            if(fecha)
                evento.set("Fecha", new Date(fecha));
            if(foto){
                var imagen = new Imagen();
                imagen.id = foto.objectId;
                evento.set("Imagen", imagen);
            }
            if(fotos){
                var relation = evento.relation("Fotos");
                relation.query().find({
                    success:function(data){
                        relation.remove(data);
                        for(var fotoKey in fotos){
                            var imagen = new Imagen();
                            imagen.id = fotos[fotoKey].objectId;
                            relation.add(imagen);
                        }
                        evento.save(null, {
                            success: function (evento) {
                                res.json(evento);
                            },
                            error: function (evento, error) {
                                res.json(error);
                            }
                        });
                    },error:function(error){
                        res.json(error);
                    }
                })
            }else{
                evento.save(null, {
                    success: function (evento) {
                        res.json(evento);
                    },
                    error: function (evento, error) {
                        res.json(error);
                    }
                });
            }

        },
        error: function (evento, error) {
            res.json(error);
        }
    });
};

exports.getEventoEditar = function (req, res,next) {
    var id = req.query.idEvento;
    var query = new Parse.Query(Evento);
    var query2 = new Parse.Query(ComentarioEvento);
    query.include("Organizacion");
    query.include("Imagen");
    query2.select("Comentario", "Usuario");
    query2.include("Usuario");
    var respuesta = {};
    query.get(id).then(function (data) {
        if(data){
            respuesta.Nombre = data.get("Nombre");
            respuesta.Descripcion = data.get("Descripcion");
            respuesta.Contenido = data.get("Contenido");
            respuesta.Categorias = data.get("Categorias");
            respuesta.Fecha = data.createdAt;
            respuesta.Organizacion = data.get("Organizacion");
            respuesta.Imagen = data.get("Imagen");
            var relation = data.relation("Fotos");
            var query3 = relation.query();
            query3.find({
                success: function (fotos) {
                    respuesta.Fotos = fotos;
                    res.json(respuesta);
                },
                error: function (error) {
                    return next({error:error});
                }
            });
        }else{
            return next({error:"evento not found"});
        }
    },function(error){
        return next({error:error});
    });
};
exports.borrarEvento = function (req, res,next) {
    var id = req.body.idEvento;
    var query = new Parse.Query(Evento);
    query.get(id).then(function(evento){
        var queryParticipaciones = new Parse.Query(Participacion);
        queryParticipaciones.equalTo("Evento", evento);
        queryParticipaciones.find().then(function(participaciones){
            for (var key in participaciones){
                participaciones[key].destroy();
            }
            var queryComentarios = new Parse.Query(ComentarioEvento);
            queryComentarios.equalTo("Evento", evento);
            queryComentarios.find().then(function(comentarios){
                for (var key in comentarios){
                    comentarios[key].destroy();
                }
                evento.destroy({
                    success: function() {
                        res.send("OK")
                    },
                    error: function(error) {
                        return next(error);
                    }
                });
            },function(error){return next(error)});
        },function(error){return next(error)});
    },function(error){return next(error);})
};