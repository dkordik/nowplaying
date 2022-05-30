const { systemPreferences } = require("electron");
const { argv } = require("node:process");

const { SEPARATOR } = require("./tokens");

const [, , SERIALIZED_EVENT_NAMES] = argv;
const EVENT_NAMES = SERIALIZED_EVENT_NAMES.split(SEPARATOR);

EVENT_NAMES.forEach((eventName) => {
    systemPreferences.subscribeNotification(eventName, (event, userInfo) => {
        const serializedUserInfo = JSON.stringify(userInfo);
        console.log(event + SEPARATOR + serializedUserInfo);
    });
});
