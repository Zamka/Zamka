require('cloud/app.js');

//Todo: Login
Parse.Cloud.define("Login", function (request, response) {

    var email = request.params.email;
    var password = request.params.password;
    var fbId = request.params.fbId;

    if (password === null) {

    } else {
        if (password != null && email != null) {
            Parse.User.logIn(email, password, {
                success: function (user) {
                    var User = Parse.Object.extend("_User");
                    var query = new Parse.Query(User);
                    response.success(user);
                    query.get(user.objectId, {
                        success: function (user) {
                            response.success(user);
                        },
                        error: function (user, error) {
                            response.error(error.message);
                        }
                    });
                },
                error: function (user, error) {
                    response.error(error.message);
                }
            });
        } else {
            response.error("Datos Incompletos");
        }
    }

});

Parse.Cloud.define("Registrar", function (request, response) {

    var email = request.params.email;
    var password = request.params.password;
    var cover = new Parse.File("cover.png", request.params.cover);
    var foto = new Parse.File("photo.png", request.params.photo);
    var name = request.params.name;
    var gustos = request.params.gustos;
    var bio = request.params.bio;
    var gender = request.params.gender;

    //Parse.Cloud.useMasterKey();

    var user = new Parse.User();
    user.setUsername(email);
    user.setEmail(email);
    user.setPassword(password);

    //user.set("cover", cover);
    //user.set("foto", foto);

    user.set("name", name);
    user.set("bio", bio);
    user.set("gender", gender);

    cover.save().then(function () {
        return foto.save();
    }, function (error) {
        response.error(error);
    }).then(function () {

    }, function (error) {
        response.error(error);
    }).then(function () {

    }, function (error) {
        response.error(error);
    });

    response.success(user);

});


Parse.Cloud.define("Categorias", function (request, response) {
    var Categorias = Parse.Object.extend("Categorias");
    var query = new Parse.Query(Categorias);
    query.find({
        success: function (categorias) {
            response.success(categorias);
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
});
