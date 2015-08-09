var User = Parse.User.extend("User");


// Shows the list of memes
exports.login = function (req, res) {
    var correo = req.body.correo;
    var password = req.body.password;
    var fbId = req.body.fbId;
    var query = new Parse.Query(User);
    if (password === null) {
        query.equalTo("username", correo);
        query.equalTo("fbId", fbId);
        query.find().then(function (user) {
            res.json(user);
        });
    } else {
        Parse.User.logIn(correo, password, {
            success: function (user) {
                return (user);
            },
            error: function (user, error) {
                res.json(error);
            }
        });
    }
    var email = req.body.email;
    res.send(email);
    query.descending('createdAt');
};

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
    query.get(id, function (usuario) {
        res.json(usuario);
    });
};
