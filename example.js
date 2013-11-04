#!/usr/bin/env node

var nowplaying = require("./index.js");

nowplaying.on("playing", function (data) {
    console.log("PLAYING!", data);
});

nowplaying.on("paused", function (data) {
    console.log("PAUSED!", data);
});