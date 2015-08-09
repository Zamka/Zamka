var Evento = Parse.Object.extend("Evento");
var User = Parse.User.extend("User");
var Participacion = Parse.Object.extend("Participacion");

exports.participar = function (req, res) {
    var participacion = new Participacion();
    var idEvento = req.body.idEvento;
    var idUsuario = req.body.idUsuario;
    var evento = new Evento();
    evento.id = idEvento;
    var usuario = new User();
    usuario.id = idUsuario;

    participacion.set("Usuario", usuario);
    participacion.set("Evento", evento);
    participacion.set("Estado", 0);
    participacion.set("Asistencia", false);

    participacion.save(null, {
        success: function (participacion) {
            res.json(participacion);
        },
        error: function (participacion, error) {
            res.json(error);
        }
    });

};

exports.getParticipaciones = function (req, res) {
    var idUsuario = req.query.idUsuario;
    var usuario = new User();
    usuario.id = idUsuario;

    var query = new Parse.Query(Participacion);
    query.limit(100);
    query.equalTo("Usuario", usuario);
    query.select("Evento", "Estado", "Asistencia");
    query.include(["Evento.Organizacion"]);
    //query.include("Usuario");
    //query.include("Evento");
    query.descending('createdAt');
    query.find().then(function (participaciones) {
        var respuesta = [];
        var numero = 0;
        participaciones.forEach(function (partic) {
            var temp = {};
            temp.evento = partic.get("Evento");
            temp.asistencia = partic.get("Asistencia");
            temp.estado = partic.get("Estado");
            respuesta[numero++] = temp;
        });

        res.send(respuesta);
    }, function (error) {
        res.send(error);
    });
};