var ComentarioEvento = Parse.Object.extend("ComentarioEvento");
var ComentarioOrganizacion = Parse.Object.extend("ComentarioOrganizacion");
var Ong = Parse.Object.extend("Organizacion");

exports.comentariosOng = function (req, res,next) {
    var idOng = req.query.idONG;
    var query = new Parse.Query(ComentarioOrganizacion);
    console.log(idOng);
    var ong = new Ong();
    ong.id = idOng;
    query.equalTo("Organizacion", ong);
    query.include("Usuario");
    query.find().then(function(comentarios){
        var comentariosFormatted =[];
        for (var key in comentarios){
            comentariosFormatted.push({
                comentario:comentarios[key].get("Comentario"),
                fecha:comentarios[key].createdAt,
                usuario:{
                    id:comentarios[key].get("Usuario").id,
                    nombre:comentarios[key].get("Usuario").get("Nombre"),
                    foto:comentarios[key].get("Usuario").get("image")["_url"]
                }
            });
        }
        res.json(comentariosFormatted);
    },function(err){
        return next(err);
    });
}