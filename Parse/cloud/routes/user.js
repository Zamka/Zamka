var User = Parse.Object.extend("User");


// Shows the list of memes
exports.login = function (req, res) {
    var email = req.body.email;
    res.send(email);
    var query = new Parse.Query(Meme);
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
    var query = new Parse.Query(Meme);
    query.limit(50);
    query.notEqualTo('text1', '');
    query.descending('views');

    query.find().then(function (memes) {
        res.render('meme/index', {
            title: "Popular Memes",
            memes: memes
        });
    });
};
