var Imagenes = Parse.Object.extend("Imagenes");
var Ong = Parse.Object.extend("Organizacion");

// Shows the list of memes
exports.fetch = function (req, res) {
    var query = new Parse.Query(Imagenes);
    query.limit(100);
    query.ascending('createdAt');
    query.find().then(function (imagenes) {
        res.json(imagenes);
    });
};
exports.getImagenes = function (req, res) {
    var query = new Parse.Query(Imagenes);
    var organizacion = req.query.idONG;
    query.limit(200);
    query.equalTo("Organizacion", organizacion);
    query.descending('createdAt');
    query.find().then(function (imagenes) {
        res.json(imagenes);
    });
};

exports.getImagen = function (req, res) {
    var query = new Parse.Query(Imagenes);
    var idImagen = req.query.idImagen;
    query.get(idFoto,{
        success:function (imagen) {
            res.json(imagen);
        },
        error:function(imagen,error){
            res.json(error);
        }
    });
};

exports.addImagen = function (req, res) {
    var idOng = req.body.idONG;
    var imagen = req.body.imagen;
    var ong = new Ong();
    ong.id = idOng;
    var file = new Parse.File("img.png", imagen, "image/png");

    file.save().then(function(){
        var Imagen = new Imagenes();
        Imagen.set("Organizacion", ong);
        Imagen.set("Archivo", file);
        Imagen.save(null, {
            success: function (resultado) {
                res.json(resultado);
            },
            error: function (evento, error) {
                res.json(error);
            }
        });
    },function(error){
        res.json(error);
    });

};

exports.delete = function (req, res) {
    var organizacion = req.body.idONG;
    var imagen = req.body.idImagen;
    var query = new Parse.Query(Imagenes);

    query.limit(200);
    query.equalTo("Organizacion", organizacion);
    query.equalTo("objectId", imagen);
    query.find().then(function (imagenes) {
        imagenes.destroy({
            success: function (myObject) {
                res.send(myObject);
            },
            error: function (myObject, error) {
                res.send(error);
            }
        });
    });

};