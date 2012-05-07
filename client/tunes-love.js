Songs = new Meteor.Collection("songs");

Meteor.subscribe('nowplaying');

NowPlaying = new Meteor.Collection("nowplaying");

var np = NowPlaying.find({}).observe({
    changed: function(new_song, i, old_song) {
        $("#now-playing").html(new_song.track);
        console.log("np", new_song.track);
    }
});

Template.da_list.songs = function() {
    var songs = Songs.find({}, { sort: { created: 1 } });
    var rankCounter = 1;

    var rankedsongs = songs.map(function(song) {
        song.rank = rankCounter;
        rankCounter++;
        return song;
    });

    return rankedsongs;
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

Template.list_item.events = {
    "click .icon-remove": function(e) {
        if (this._id) {
            Songs.remove({ _id: this._id });
        }
    }
};

