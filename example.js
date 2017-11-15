#!/usr/bin/env node

var nowplaying = require("./index.js");

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
