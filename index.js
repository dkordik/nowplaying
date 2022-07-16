#!/usr/bin/env node

const EventEmitter = require("events");
const camelcaseKeys = require("camelcase-keys");
const electron = require("electron");
const proc = require("child_process");
const path = require("path");

const { SEPARATOR } = require("./tokens");

const EVENT_NAME_FROM_APP = {
    spotify: "com.spotify.client.PlaybackStateChanged",
    itunes: "com.apple.iTunes.playerInfo",
};

const EVENT_NAMES = [EVENT_NAME_FROM_APP.spotify, EVENT_NAME_FROM_APP.itunes];

const getAppFromEventName = (eventName) =>
    Object.keys(EVENT_NAME_FROM_APP).find(
        (key) => EVENT_NAME_FROM_APP[key] === eventName
    );

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
            path.join(__dirname, "electronNotificationListener.js"),
            EVENT_NAMES.join(SEPARATOR),
        ]);

        child.stdout.on("data", (rawData) => {
            const data = rawData.toString();
            const { eventName, userInfo } = parseEvent(data);
            const camelCasedUserInfo = camelcaseKeys(userInfo);
            const playerState = camelCasedUserInfo.playerState.toLowerCase();

            camelCasedUserInfo.eventName = eventName;
            camelCasedUserInfo.source = getAppFromEventName(eventName);
            if (
                eventName === EVENT_NAME_FROM_APP.itunes &&
                camelCasedUserInfo.storeUrl ===
                    "itmss://itunes.com/link?n=Connecting%E2%80%A6"
            ) {
                this.emit("connecting", camelCasedUserInfo);
            } else {
                this.emit(playerState, camelCasedUserInfo);
            }
        });

        child.stdout.on("error", (err) => {
            this.emit("error", err);
        });
    }
}

module.exports = new NowPlaying();
