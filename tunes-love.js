Songs = new Meteor.Collection("songs");

if (Meteor.is_client) {

    Template.da_list.songs = function() {
        return Songs.find({}, { sort: { created: 1 } });
    };

    Template.queue_song.events = {

        "submit form": function(e) {
            e.preventDefault();

            Songs.insert({
                artist: $("#artist").val(),
                song: $("#song-title").val(),
                created: (new Date()).getTime()
            });

            $("#artist, #song-title").val('').first().focus();

            return false;
        }

    };
}

if (Meteor.is_server) {

    Meteor.startup(function () {
        if (Songs.find({}).count() === 0) {
            var queue = [
                { artist: "DLC", song: "Lines", created: (new Date()).getTime() },
                { artist: "TBE", song: "This Year", created: (new Date()).getTime() }
            ];

            _.each(queue, function(song) { Songs.insert(song); });
        }
    });
}