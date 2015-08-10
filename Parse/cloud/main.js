require('cloud/app.js');

Parse.Cloud.define("Login", function (request, response) {



    response.success("login");
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