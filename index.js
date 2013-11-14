#!/usr/bin/env node

var util = require('util');
var spawn = require('child_process').spawn;
var events = require('events');

var NowPlaying = function () {
	this.init();
};

NowPlaying.prototype.init = function () {
	var instance = this;
	instance.playerinfo = spawn(__dirname + "/playerinfo.rb", []);
	instance.playerinfo.stdout.on("data", function (data) {
		var buff = new Buffer(data);
		var obj = JSON.parse(buff.toString('utf8'));

		instance.emit(obj["playerState"].toLowerCase(), obj);
	});
	instance.playerinfo.stdout.on("end", function (data) {
		instance.init();
	});
}

NowPlaying.prototype.__proto__ = events.EventEmitter.prototype

module.exports = new NowPlaying();
