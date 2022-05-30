# nowplaying

Simple Node.js event emitter for iTunes/Spotify playing/paused events.

Uses Electron's subscribeNotifications to observe macOS Distributed Notifications

### Requires

-   macOS. Tested up to Monteray
-   Node.js

### Install

```shell
npm install nowplaying
```

### Usage

```javascript
var nowplaying = require("nowplaying");

nowplaying.on("playing", (data) => {
    console.log("PLAYING!", data);
});

nowplaying.on("paused", (data) => {
    console.log("PAUSED!", data);
});

nowplaying.on("stopped", (data) => {
    console.log("STOPPED!", data);
});

nowplaying.on("error", (data) => {
    console.log("ERROR!", data);
});

// data, if Spotify:

// { source: 'Spotify',
//   playerState: 'Playing',
//   name: 'Planet Party',
//   trackId: 'spotify:track:0X36qGG3g5yTLDIoIxWkLR',
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

// data, if iTunes:

// { source: 'iTunes',
//   discNumber: 1,
//   trackCount: 11,
//   trackNumber: 5,
//   name: 'Flightwave',
//   playerState: 'Playing',
//   persistentId: 1628654696,
//   albumArtist: 'Com Truise',
//   location: 'file://localhost/Volumes/Music/Com%20Truise/Galactic%20Melt/05%20Flightwave.mp3',
//   composer: 'Com Truise',
//   artist: 'Com Truise',
//   ratingComputed: true,
//   skipCount: 0,
//   year: 2011,
//   discCount: 1,
//   libraryPersistentId: 1522701079,
//   playCount: 3,
//   artworkCount: 1,
//   storeURL: 'itms://itunes.com/link?n=Flightwave&an=Com%20Truise&pn=Galactic%20Melt&cn=Com%20Truise',
//   playlistPersistentId: -862874234,
//   playDate: '2013-10-29 06:15:07 +0000',
//   rating: 80,
//   totalTime: 304587,
//   genre: 'Electronic',
//   albumRatingComputed: 0,
//   album: 'Galactic Melt',
//   albumRating: 80 }
```
