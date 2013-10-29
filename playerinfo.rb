#!/usr/bin/env ruby

require 'eventmachine-distributed-notification'
require 'json'

class Watcher < EM::DistributedNotificationWatch
  def notify(name, user_info)
	puts user_info.to_json
	exit(0)
  end
end

EM.run {
  EM.watch_distributed_notification('com.apple.iTunes.playerInfo', Watcher)
}
