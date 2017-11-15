// based on abhishekjairath's Gist here:
// https://gist.github.com/abhishekjairath/8bfb259c681ef52545b32c88db6336f5


// notificationNames: array of Distributed Notification names, e.g. ['com.apple.iTunes.playerInfo']

module.exports = (notificationNames, callback, errorCallback) => {
    let events = require('events');
    let $ = require('nodobjc');
    const DELEGATE_KEY = 'nowplaying:';

    $.framework('Foundation');
    $.framework('AppKit');

    let GetSongs = $.NSObject.extend('Delegate');

    GetSongs.addMethod(DELEGATE_KEY, 'v@:@', (self, _cmd, notif) => {
        let userInfo = notif('userInfo')
        let keys = userInfo('keyEnumerator');
        let key;
        let song = {};

        while(key = keys('nextObject')){
            var value = userInfo('objectForKey', key)
            song[key.toString()] = value.toString();
        }

        callback(song);
    });

    GetSongs.register();

    let nc = $.NSDistributedNotificationCenter('defaultCenter');

    notificationNames.forEach((notificationName) => {
        nc('addObserver',   GetSongs('alloc')('init'),
            'selector',     DELEGATE_KEY,
            'name',         $(notificationName),
            'object',       null);
    });

    let app = $.NSApplication('sharedApplication');

    let runLoop = () => {
        let pool = $.NSAutoreleasePool('alloc')('init');

        try {
            app('nextEventMatchingMask', $.NSAnyEventMask.toString(),
                'untilDate',             $.NSDate('distantFuture'),
                'inMode',                $.NSDefaultRunLoopMode,
                'dequeue',               1);
        } catch(e) {
            errorCallback(e);
        }

        pool('drain');
        setTimeout(runLoop, 500);
    }

    runLoop();
};
