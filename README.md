nowplaying-itunes
=================

Simple node JS event emitter wrapping Ruby EventMachine Distributed Notification for com.apple.iTunes.playerInfo

###Requires
- Ruby, gems:
 - eventmachine-distributed-notification
 - json
- Node

###Usage
```javascript
var nowplaying = require("./watch_now_playing.js");

nowplaying.on("playing", function (data) {
	console.log("PLAYING!", data);
// data =
// { discNumber: 1,
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
});

nowplaying.on("paused", function (data) {
	console.log("PAUS'D!", data);
	//...
});
```
