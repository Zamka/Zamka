require('cloud/app.js');

var Participacion = Parse.Object.extend("Participacion");

Parse.Cloud.beforeSave("Participacion", function (request, response) {
    var evento = request.object.get("Evento");
    var usuario = request.object.get("Usuario");
    var query = new Parse.Query(Participacion);
    query.equalTo("Usuario", usuario);
    query.equalTo("Evento", evento);
    query.count({
        success: function (count) {
            if (count === 0) {
                response.success();
            } else {
                response.error("Usuario Ya inscrito");
            }
        },
        error: function (error) {
            response.error(error);
        }
    });
});