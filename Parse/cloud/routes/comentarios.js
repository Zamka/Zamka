var ComentarioEvento = Parse.Object.extend("ComentarioEvento");
var ComentarioOrganizacion = Parse.Object.extend("ComentarioOrganizacion");
var Ong = Parse.Object.extend("Organizacion");
var User = Parse.User.extend("User");
var Evento = Parse.Object.extend("Evento");
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

exports.comentarEvento = function (req,res,next){
    var comentario = req.body.comentario;
    var idUsuario = req.body.idUsuario;
    var idEvento = req.body.idEvento;
    var usuario = new User();
    usuario.id = idUsuario;
    var evento = new Evento();
    evento.id = idEvento;
    var comentarioObj = new ComentarioEvento();
    comentarioObj.set("Evento",evento);
    comentarioObj.set("Usuario",usuario);
    comentarioObj.set("Comentario",comentario);
    comentarioObj.save(null,{
        success:function(data){
            res.json(data)
        }
        ,error:function(error){return next(error)}
    });
}

exports.comentarOng = function (req,res,next){
    var comentario = req.body.comentario;
    var idUsuario = req.body.idUsuario;
    var idOng = req.body.idOng;
    var usuario = new User();
    usuario.id = idUsuario;
    var ong = new Ong();
    ong.id = idOng;
    var comentarioObj = new ComentarioOrganizacion();
    comentarioObj.set("Organizacion",ong);
    comentarioObj.set("Usuario",usuario);
    comentarioObj.set("Comentario",comentario);
    comentarioObj.save(null,{
        success:function(data){
            res.json(data)
        }
        ,error:function(error){return next(error)}
    });
}