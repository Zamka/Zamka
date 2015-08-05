
var Meme = Parse.Object.extend("Meme");

// Shows the list of memes
exports.index = function(req, res) {
    var query = new Parse.Query(Meme);
    query.limit(100);
    query.descending('createdAt');
    query.find().then(function(memes) {
        res.render('meme/index', {
            title: "Popular Memes",
            memes: memes
        });
    });
};

// Shows a list of popular memes based on view count
exports.popular = function(req, res) {
    var query = new Parse.Query(Meme);
    query.limit(50);
    query.notEqualTo('text1', '');
    query.descending('views');

    query.find().then(function(memes) {
        res.render('meme/index', {
            title: "Popular Memes",
            memes: memes
        });
    });
};

// Create a new meme page
exports.new = function(req, res) {
    res.render('meme/new', {
        title: "Create a Meme"
    });
};

// Creates a meme
exports.create = function(req, res) {
    var meme = new Meme();

    if (req.body.text1 === "") {
        res.status(403).send('Top text cannot be blank');
    }

    // Set metadata fields
    meme.set('image', req.body.url);
    meme.set('text1', req.body.text1);
    meme.set('text2', req.body.text2);

    // Memes are read only
    var acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    meme.setACL(acl);

    meme.save().then(function(object) {
        res.send({ url: "/meme/" + object.id });
    }, function(error) {
        res.send('Error saving meme!');
    });
};

// Shows a meme
exports.show = function(req, res) {
    var objectId = req.params.objectId;
    var query = new Parse.Query(Meme);

    query.get(objectId).then(function(meme) {
        Parse.Cloud.useMasterKey();

        // Increment the view counter
        meme.increment("views");
        meme.save().then(function() {
            res.render('meme/show', {
                meme: meme,
                title: "Show",
                imageUrl: meme.get('image'),
                openGraphTags: {
                    title: meme.get('text1') + " " + meme.get('text2'),
                    url: "http://www.anymeme.org/meme/" + meme.id,
                    image: meme.get('image'),
                    type: "website"
                }
            });
        }, function(error) {
            res.send(error);
        });
    }, function() {
        res.status(404).send("Meme not found.");
    });
};