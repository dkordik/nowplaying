nowplaying
=================

Simple node JS event emitter for iTunes/Spotify/Rdio playing/paused events. Wraps Ruby EventMachine Distributed Notification

###Requires
- Ruby, gems:
 - eventmachine-distributed-notification
 - json
- Node

###Usage
```javascript
var nowplaying = require("../nowplaying-itunes");

nowplaying.on("playing", function (data) {
	console.log("PLAYING!", data);
});

nowplaying.on("paused", function (data) {
	console.log("PAUS'D!", data);
});

// data, if Spotify:

// { source: 'Spotify',
//   playerState: 'Playing',
//   name: 'Planet Party',
//   trackID: 'spotify:track:0X36qGG3g5yTLDIoIxWkLR',
//   starred: true,
//   discNumber: 1,
//   hasArtwork: true,
//   playCount: 0,
//   location: '/Volumes/Music/Games/That We Play/3-Planet_Party.mp3',
//   album: 'That We Can Play - EP',
//   popularity: 1,
//   duration: 168,
//   artist: 'Games',
//   albumArtist: 'Games',
//   playbackPosition: 0,
//   trackNumber: 3 }

// data, if Rdio:

// { source: 'Rdio',
//   album: 'Confess',
//   class: 'track',
//   rdiourl: '/artist/Twin_Shadow/album/Confess/track/Golden_Light/',
//   artist: 'Twin Shadow',
//   key: 't17983895',
//   duration: '277',
//   name: 'Golden Light',
//   playerState: 'playing' }

// data, if iTunes:

// { source: 'iTunes',
//   discNumber: 1,
//   trackCount: 11,
//   trackNumber: 5,
//   name: 'Flightwave',
//   playerState: 'Playing',
//   persistentID: 1628654696,
//   albumArtist: 'Com Truise',
//   location: 'file://localhost/Volumes/Music/Com%20Truise/Galactic%20Melt/05%20Flightwave.mp3',
//   composer: 'Com Truise',
//   artist: 'Com Truise',
//   ratingComputed: true,
//   skipCount: 0,
//   year: 2011,
//   discCount: 1,
//   libraryPersistentID: 1522701079,
//   playCount: 3,
//   artworkCount: 1,
//   storeURL: 'itms://itunes.com/link?n=Flightwave&an=Com%20Truise&pn=Galactic%20Melt&cn=Com%20Truise',
//   playlistPersistentID: -862874234,
//   playDate: '2013-10-29 06:15:07 +0000',
//   rating: 80,
//   totalTime: 304587,
//   genre: 'Electronic',
//   albumRatingComputed: 0,
//   album: 'Galactic Melt',
//   albumRating: 80 }
```
