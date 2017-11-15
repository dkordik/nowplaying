#!/usr/bin/env node

const EventEmitter = require('events');
const camelcaseKeys = require('camelcase-keys');
const notificationListener = require('./notificationListener.js');

class NowPlaying extends EventEmitter {
    constructor() {
        super();
        this.setupNotifications([
            'com.apple.iTunes.playerInfo',
            'com.spotify.client.PlaybackStateChanged'
        ]);
    }

    setupNotifications(notificationNames) {
        notificationListener(notificationNames, (state) => {
            let camelCasedState = camelcaseKeys(state);
            this.emit(camelCasedState.playerState.toLowerCase(), camelCasedState);
        }, (err) => {
            this.emit('error', err);
        });
    }
}

module.exports = new NowPlaying();
