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
    }
    var email = req.body.email;
    res.send(email);
    query.descending('createdAt');
    query.find().then(function (memes) {
        res.render('meme/index', {
            title: "Popular Memes",
            memes: memes
        });
    });
};

// Shows a list of popular memes based on view count
exports.registro = function (req, res) {

    var user = new Parse.User();

};
