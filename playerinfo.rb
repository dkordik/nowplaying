#!/usr/bin/env ruby

require 'eventmachine-distributed-notification'
require 'json'

class Hash
  def to_utf8
    Hash[
      self.collect do |k, v|
        if (v.respond_to?(:to_utf8))
          [ k, v.to_utf8 ]
        elsif (v.respond_to?(:encoding))
          [ k, v.dup.force_encoding('UTF-8') ]
        else
          [ k, v ]
        end
      end
    ]
  end
end

class Watcher < EM::DistributedNotificationWatch
  def notify(name, user_info)
	puts user_info.to_utf8.to_json
	exit(0)
  end
end

EM.run {
  EM.watch_distributed_notification('com.apple.iTunes.playerInfo', Watcher)
}
