var User = Parse.User.extend("User");
var Participacion = Parse.Object.extend("Participacion");
var Inscripcion = Parse.Object.extend("Inscripcion");
var ONG = Parse.Object.extend("Organizacion");


exports.inscripcion = function (req, res) {
    var insc = new Inscripcion();
    var nombre = req.body.nombre;
    var correo = req.body.correo;
    var tipo = req.body.tipo;
    insc.set("nombre", nombre);
    insc.set("correo", correo);
    insc.set("tipo", tipo);
    insc.save(null, {
        success: function (inscripcion) {
            res.json(inscripcion);
        },
        error: function (inscripcion, error) {
            res.json(inscripcion);
        }
    });

};
exports.login = function (req, res,next) {
    var correo = req.body.correo;
    var password = req.body.password;
    var fbId = req.body.fbid;
    console.log("login");
    if (password === null || password === undefined) {
        Parse.Cloud.httpRequest({
            url: 'https://graph.facebook.com/me?access_token='+fbId,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        }).then(function(data) {
            console.log("FB-login");
            var fbid = data.data.id;
            var email = data.data.email;
            var gender = data.data.gender;
            var name = data.data.name;
            var query = new Parse.Query(User);
            query.equalTo("facebookID", fbid);
            query.first().then(function (user) {
                if(user){
                    console.log("FB - Encontrado");
                    res.json(user);
                }else{
                    console.log("Buscando Correo");
                    var query2 = new Parse.Query(User);
                    query2.equalTo("username", email);
                    query2.first().then(function (emailUser) {
                        if(emailUser){
                            console.log("Correo Encontrado");
                            Parse.Cloud.useMasterKey();
                            console.log("Permiso de Llave Maestra");
                            emailUser.set("facebookID", fbid);
                            emailUser.save(null,{
                                success:function(response){
                                    console.log("Usuario Actualizado");
                                    console.log(response);
                                    res.json(response);
                                }
                                ,error:function(error){return next(error);}
                            });
                        }else{
                            console.log("Nuevo Usuario");
                            Parse.Cloud.httpRequest({
                                url:"http://graph.facebook.com/" + fbid + "/picture?height=400&width=400",
                                method: 'GET',
                                followRedirects:true
                            }).then(function(httpResponse){
                                var imageBuffer = httpResponse.buffer;
                                var file = new Parse.File("img.jpg", {base64:imageBuffer.toString('base64')}, "image/jpeg");
                                file.save().then(function(){
                                    var newUser = new Parse.User();
                                    newUser.set("username", email);
                                    newUser.set("email", email);
                                    newUser.set("password", "Z!mkaPasWoRasHascBcSReasons");
                                    newUser.set("facebookID", fbid);
                                    newUser.set("gender", gender);
                                    newUser.set("name", name);
                                    newUser.set("image", file);
                                    newUser.signUp(null, {
                                        success: function (user) {
                                            res.json(user);
                                        },
                                        error: function (user, error) {
                                            return next(error);
                                        }
                                    });
                                },function(error){return next(error);});
                            },function(error){return next(error);});

                        }
                    });
                }
            },function(error){return next(error);});

        }, function(error) {return next(error);});
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

    var correo = req.body.correo;
    var password = req.body.password;
    var fbid = req.body.fbid;
    var cover = req.body.cover;
    var foto = req.body.foto;
    var nombre = req.body.nombre;
    var gustos = req.body.gustos;
    var sexo = req.body.sexo;
    var biografia = req.body.biografia;

    user.set("username", correo);
    user.set("email", correo);
    if (password === undefined || password === null) {
        user.set("password", "Z!mkaPasWoRasHascBcSReasons");
        user.set("fbid", fbid);
    } else {
        user.set("password", password);
    }
    user.set("gender", sexo);
    user.set("name", nombre);
    user.set("bio", biografia);
    user.set("Gustos", gustos);



    Parse.Cloud.httpRequest({
        url:"http://www.zamka.org/img/profile.png",
        method: 'GET',
        followRedirects:true
    }).then(function(httpResponse){
        var imageBuffer = httpResponse.buffer;
        var file = new Parse.File("img.jpg", {base64:imageBuffer.toString('base64')}, "image/jpeg");
        file.save().then(function(){
            user.set("image", file);
            user.signUp(null, {
                success: function (user) {
                    res.json(user);
                },
                error: function (user, error) {
                    res.json(error);
                }
            });
        },function(error){return next(error);});
    },function(error){return next(error);});
};

exports.loginOrganizacion = function (req, res) {
    var usuario = req.body.usuario;
    var password = req.body.password;

    Parse.User.logIn(usuario, password, {
        success: function (user) {
            if (user.get("organizacion") === undefined) {
                res.send("Usuario no posee ninguna organizacion");
            } else {
                var orgId = user.get("organizacion").id;
                var query = new Parse.Query(ONG);
                query.get(orgId).then(
                    function(organizacion){
                        organizacion.relation("Fotos").query().find().then(
                            function(fotos){
                                res.json({
                                    idUser:user.id,
                                    idOrganizacion:organizacion.id,
                                    Categorias:user.get("Gustos"),
                                    Contenido:organizacion.get("Contenido"),
                                    Descripcion:organizacion.get("Descripcion"),
                                    Nombre:organizacion.get("Nombre"),
                                    Foto:organizacion.get("Foto")["_url"],
                                    Fotos:fotos
                                });
                            });

                    },
                    function(data,error){
                        res.json(error);
                    }
                );
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
                participacionrespuesta[i].Categorias = participacion.get("Evento").get("Categorias");
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

exports.updateUser = function(req,res,next){
    var id = req.body.idUsuario;
    var foto = req.body.foto;
    var nombre = req.body.nombre;
    var sexo = req.body.sexo;
    var email = req.body.email;
    var gustos = req.body.categorias;
    var notif = req.body.notif;
    var newPass = req.body.newPass;

    Parse.Cloud.useMasterKey();
    var query = new Parse.Query(User);
    query.get(id).then(function(usuario){
        usuario.set("username",email);
        usuario.set("email",email);
        usuario.set("gender",sexo);
        usuario.set("name",nombre);
        usuario.set("Gustos",gustos);
        usuario.set("Notificaciones",notif);
        if(newPass){
            usuario.set("password",newPass);
        }
        if(foto){
            var file = new Parse.File("img.jpg", {base64:foto}, "image/jpeg");
            file.save().then(function(){
                usuario.set("image", file);
                usuario.save(null, {
                    success: function (user) {
                        res.json(user);
                    },
                    error: function (error) {
                        return next(error);
                    }
                });
            },function(error){return next(error);});
        }else{
            usuario.save(null, {
                success: function (user) {
                    res.json(user);
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
