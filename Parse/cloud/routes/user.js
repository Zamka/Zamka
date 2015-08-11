var User = Parse.User.extend("User");
var Participacion = Parse.Object.extend("Participacion");

// Shows the list of memes
exports.login = function (req, res) {
    console.log(req.body);
    var correo = req.body.correo;
    var password = req.body.password;
    var fbId = req.body.fbId;

    var query = new Parse.Query(User);
    console.log(password);
    if (password === null || password === undefined) {
        query.equalTo("username", correo);
        query.equalTo("fbId", fbId);
        query.first().then(function (user) {
            res.json(user);
        }, function (error) {
            res.json(error);
        });
    } else {
        Parse.User.logIn(correo, password, {
            success: function (user) {
                res.json(user);
            },
            error: function (user, error) {
                res.json(error);
            }
        });
    }
}
;

// Shows a list of popular memes based on view count
exports.registro = function (req, res) {
    var user = new Parse.User();
};

exports.loginOrganizacion = function (req, res) {
    var usuario = req.body.usuario;
    var password = req.body.password;

    Parse.User.logIn(usuario, password, {
        success: function (user) {
            if (user.get("organizacion") === undefined) {
                res.send("Usuario no posee ninguna organizacion");
            } else {
                var organizacion = user.get("organizacion");
                organizacion.fetch({
                    success: function (organizacion) {
                        res.json(organizacion);
                    }
                });

            }
        },
        error: function (user, error) {
            res.json(error);
        }
    });
};

exports.getUser = function (req, res) {
    var id = req.query.idUsuario;
    var query = new Parse.Query(User);
    var query2 = new Parse.Query(Participacion);
    var respuesta = {};
    var participacionrespuesta = [];
    query2.include("Evento");
    query.get(id, function (usuario) {
        query2.equalTo("Usuario", usuario);
        query2.equalTo("Asistencia", true);
        query2.find().then(function (participaciones) {
            var i = 0;
            participaciones.forEach(function (participacion) {
                participacionrespuesta[i] = {};
                participacionrespuesta[i].idEvento = participacion.get("Evento").id;
                participacionrespuesta[i].Descripcion = participacion.get("Evento").get("Descripcion");
                participacionrespuesta[i].Imagen = participacion.get("Evento").get("Imagen");
                participacionrespuesta[i].Fecha = participacion.get("Evento").get("Fecha");
                participacionrespuesta[i].Categorias= participacion.get("Evento").get("Categorias");
                participacionrespuesta[i++].Nombre = participacion.get("Evento").get("Nombre");
            });
            respuesta.Nombre = usuario.get("name");
            respuesta.Foto = usuario.get("image");
            respuesta.Biografia = usuario.get("bio");
            respuesta.Gustos = usuario.get("Gustos");
            respuesta.listaParticipacion = participacionrespuesta;
            res.json(respuesta);
        }, function (error) {
            res.json(error);
        });
    });
};
