var ONG = Parse.Object.extend("Organizacion");
var ComentarioOrganizacion = Parse.Object.extend("ComentarioOrganizacion");
var Evento = Parse.Object.extend("Evento");

exports.getONG = function (req, res) {
    var id = req.query.idONG;
    var query = new Parse.Query(ONG);
    var query2 = new Parse.Query(ComentarioOrganizacion);
    query2.select("Comentario", "Usuario");
    query2.include("Usuario");
    var respuesta = {};
    var comentariosrespuesta = [];
    query.get(id, function (organizacion) {
        query2.equalTo("Organizacion", organizacion);
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
            respuesta.Nombre = organizacion.get("Nombre");
            respuesta.Descripcion = organizacion.get("Descripcion");
            respuesta.Contenido = organizacion.get("Contenido");
            respuesta.Imagen = organizacion.get("Foto");
            var relation = organizacion.relation("Fotos");
            var query3 = relation.query();
            query3.find({
                success: function (fotos) {
                    respuesta.Fotos = fotos;

                    var query4 = new Parse.Query(Evento);

                    query4.include("Imagen");
                    query4.descending('Fecha');
                    query4.equalTo("Organizacion", organizacion);
                    query4.find().then(function (eventos) {

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


                        respuesta.listaEventos = eventosFormatted;
                        res.json(respuesta);
                    }, function (error) {
                        res.json(error);
                    });

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
exports.updateOrganizacion = function(req,res,next){
    var id = req.body.idONG;
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    var resumen = req.body.resumen;
    var newFoto  = req.body.newFoto;



    console.log("Editar ONG - " + id);
    var query = new Parse.Query(ONG);
    query.get(id).then(function(ong){
        console.log("ONG encontrada");
        ong.set("Nombre",nombre);
        ong.set("Descripcion",descripcion);
        ong.set("Contenido",resumen);
        if(newFoto){
            console.log("con foto");
            var file = new Parse.File("img.jpg", {base64:newFoto}, "image/jpeg");
            file.save().then(function(){
                console.log("guardando foto");
                ong.set("Foto", file);
                ong.save(null, {
                    success: function (ong) {
                        res.json(ong);
                    },
                    error: function (error) {
                        return next(error);
                    }
                });
            },function(error){return next(error);});
        }else{
            console.log("sin foto");
            ong.save(null, {
                success: function (ong) {
                    res.json(ong);
                },
                error: function (error) {
                    return next(error);
                }
            });
        }
    },function(error){
        return next(error)
    });

};