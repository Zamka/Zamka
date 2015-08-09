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
    query.descending('createdAt');
    query.include("Evento");
    query.find().then(function (participaciones) {

        res.json(participaciones);
    });
};