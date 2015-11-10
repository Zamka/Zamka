var Imagenes = Parse.Object.extend("Imagenes");

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

exports.addImagen = function (req, res) {
    var organizacion = req.body.idONG;
    var imagen = req.body.imagen;

    var file = new Parse.File("Imagen.zzz", imagen, "image/png");

    file.save(null, {
        success: function (files) {
            var Imagen = new Imagenes();
            Imagen.set("Organizacion", organizacion);
            Imagen.set("Archivo", files);
            Imagen.save(null, {
                success: function (resultado) {
                    res.json(resultado);
                },
                error: function (evento, error) {
                    res.json(error);
                }
            });

        },
        error: function (gameScore, error) {
            res.json(error);
        }
    })

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