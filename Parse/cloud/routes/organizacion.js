var ONG = Parse.Object.extend("Organizacion");

exports.getONG = function (req, res) {
    var id = req.query.idONG;
    var query = new Parse.Query(ONG);
    query.get(id, function (ong) {
        res.json(ong);
    });
};