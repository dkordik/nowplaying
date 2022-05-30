#!/usr/bin/env node

const EventEmitter = require("events");
const camelcaseKeys = require("camelcase-keys");
const electron = require("electron");
const proc = require("child_process");

const { SEPARATOR } = require("./tokens");

const EVENT_NAMES = [
    "com.spotify.client.PlaybackStateChanged",
    "com.apple.iTunes.playerInfo",
];

const parseEvent = (rawEvent) => {
    const [eventName, serializedUserInfo] = rawEvent.split(SEPARATOR);
    const userInfo = JSON.parse(serializedUserInfo);
    return { eventName, userInfo };
};

class NowPlaying extends EventEmitter {
    constructor() {
        super();
        this.setupNotifications();
    }

    setupNotifications() {
        const child = proc.spawn(electron, [
            "electronNotificationListener.js",
            EVENT_NAMES.join(SEPARATOR),
        ]);

        child.stdout.on("data", (rawData) => {
            const data = rawData.toString();
            const { eventName, userInfo } = parseEvent(data);
            const camelCasedUserInfo = camelcaseKeys(userInfo);
            const playerState = camelCasedUserInfo.playerState.toLowerCase();

            camelCasedUserInfo.eventName = eventName;
            this.emit(playerState, camelCasedUserInfo);
        });

        child.stdout.on("error", (err) => {
            this.emit("error", err);
        });
    }
}

module.exports = new NowPlaying();
