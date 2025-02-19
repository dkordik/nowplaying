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

const parseEventName = (rawEvent) => {
    const [eventName] = rawEvent.split(SEPARATOR);
    return eventName;
};

const parseUserInfo = (rawEvent) => {
    const [, serializedUserInfo] = rawEvent.split(SEPARATOR);
    let userInfo;
    try {
        userInfo = JSON.parse(serializedUserInfo);
    } catch (e) {
        console.error("Error reading info from Electron", e);
        userInfo = null;
    }
    return userInfo;
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
            try {
                const data = rawData.toString();
                const eventName = parseEventName(data);
                const userInfo = parseUserInfo(data);
                if (userInfo === null) {
                    this.emit(
                        "error",
                        new Error("Failed to pass info from Electron: " + data)
                    );
                    return;
                }
                const camelCasedUserInfo = camelcaseKeys(userInfo);
                const playerState =
                    camelCasedUserInfo.playerState.toLowerCase();

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
            } catch (err) {
                this.emit("error", err);
            }
        });

        child.stdout.on("error", (err) => {
            this.emit("error", err);
        });

        ["exit", "SIGINT", "SIGTERM"].forEach((eventName) => {
            process.on(eventName, () => {
                child.kill();
            });
        });
    }
}

module.exports = new NowPlaying();
