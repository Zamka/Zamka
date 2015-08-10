var ONG = Parse.Object.extend("Organizacion");
var ComentarioOrganizacion = Parse.Object.extend("ComentarioOrganizacion");

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
            respuesta.Nombre = organizacion.get("Nombre");
            respuesta.Descripcion = organizacion.get("Descripcion");
            respuesta.Contenido = organizacion.get("Contenido");
            respuesta.Imagen = organizacion.get("Imagen");
            //respuesta.Evento = evento;
            var relation = organizacion.relation("Fotos");
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