var Evento = Parse.Object.extend("Evento");


exports.buscar = function (req, res) {
    var busqueda = req.query.busqueda;
    var query = new Parse.Query(Evento);
    query.limit(100);
    query.contains("Nombre", busqueda);
    query.descending('createdAt');
    query.find().then(function (eventos) {
        res.json(eventos);
    });
};

exports.porCategoria = function (req, res) {
    var categoria = req.query.categoria;
    var query = new Parse.Query(Evento);
    query.limit(100);
    query.descending('createdAt');
    query.find().then(function (eventos) {
        res.json(eventos);
    });
};

exports.evento = function (req, res) {
    var id = req.query.idEvento;
    var query = new Parse.Query(Evento);
    query.get(id, function (evento) {
        res.json(evento);
    });
};