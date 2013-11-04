#!/usr/bin/env node

var util = require('util');
var exec = require('child_process').exec;
var events = require('events');

var ext_nowplaying = function (cb) {
	var context = this;
	exec(__dirname + "/playerinfo.rb", function (error, stdout, stderr) {
		if (stdout) { cb.call(context, JSON.parse(stdout)); }
		if (stderr) { console.log('stderr: ' + stderr); }
		if (error !== null) { console.error('exec error: ' + error); }
	});
}

var NowPlaying = function () {
	this.getNowPlaying();
};

NowPlaying.prototype.__proto__ = events.EventEmitter.prototype

NowPlaying.prototype.getNowPlaying = function () {
	ext_nowplaying.call(this, function (data) {
		this.emit(data["playerState"].toLowerCase(), data);
		this.getNowPlaying();
	});
}

module.exports = new NowPlaying();
