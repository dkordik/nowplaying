#!/usr/bin/env node

var util = require('util');
var spawn = require('child_process').spawn;
var events = require('events');

var NowPlaying = function () {
	this.init();
	this.lastEventData = "";
};

NowPlaying.prototype.init = function () {
	var instance = this;
	instance.playerinfo = spawn(__dirname + "/playerinfo.rb", []);
	instance.playerinfo.stdout.on("data", function (data) {
		var buff = new Buffer(data);
		var utf8string = buff.toString('utf8');
		var events = utf8string.replace(/}{/g, "}\0{").split("\0");

		events.forEach(function (eventJSON, i) {
			var eventData = JSON.parse(eventJSON);

			//Dedupe, as Rdio emits duplicate playing or paused events in some cases
			if (JSON.stringify(instance.lastEventData) != JSON.stringify(eventData)) {
				instance.emit(eventData.playerState.toLowerCase(), eventData);
				instance.lastEventData = eventData;
			}
		})

	});
	instance.playerinfo.stdout.on("end", function (data) {
		instance.init();
	});
}

NowPlaying.prototype.__proto__ = events.EventEmitter.prototype

module.exports = new NowPlaying();
