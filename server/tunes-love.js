var require     = __meteor_bootstrap__.require,
    applescript = require('applescript'),
    nowPlaying;

Songs = new Meteor.Collection("songs");

var getNowPlaying = function(cb) {
    var script = [
        'tell application "iTunes"',
        '\t(artist of current track) & " - " & (name of current track)',
        'end tell'
    ].join("\n");

    applescript.execString(script, function(err, result) {
        cb(result);
    });
};

Meteor.publish("nowplaying", function() {
    var pub = this;
    var uuid = Meteor.uuid();

    Meteor.setInterval(function() {
        getNowPlaying(function(np) {
            if (np != nowPlaying || !nowPlaying) {
                nowPlaying = np;
                pub.set("nowplaying", uuid, { track: np });
                pub.flush();
            }
        });
    }, 500);
});

Meteor.startup(function () {
    if (Songs.find({}).count() === 0) {
        var queue = [
            { artist: "Dead Letter Circus",   song: "Lines",     created: (new Date()).getTime() },
            { artist: "The Butterfly Effect", song: "This Year", created: (new Date()).getTime() }
        ];

        _.each(queue, Songs.insert);
    }
});
