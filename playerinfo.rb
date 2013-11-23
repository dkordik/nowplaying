#!/usr/bin/env ruby

require 'eventmachine-distributed-notification'
require 'json'
require 'active_support/core_ext/string/inflections'

Encoding.default_external = Encoding::UTF_8

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

  def to_camelkeyed_json
    Hash[
      self.collect { |k, v|
        [ k.gsub('ID',' ID').gsub(' ','_').camelize(:lower), v ]
      }
    ].to_json
  end

end

class ITunesWatcher < EM::DistributedNotificationWatch
  def notify(name, user_info)
    user_info["source"] = "iTunes"
    print user_info.to_utf8.to_camelkeyed_json
  end
end

class SpotifyWatcher < EM::DistributedNotificationWatch
  def notify(name, user_info)
    user_info["source"] = "Spotify"
    print user_info.to_utf8.to_camelkeyed_json
  end
end

class RdioWatcher < EM::DistributedNotificationWatch
  def notify(name, ignore)
    user_info = Hash.new
    rdio_track = `osascript -e 'tell app "Rdio" to get properties of current track'`.strip
    rdio_track.split(", ").each do |prop|
      key, val = prop.split(":")
      if key != "artwork" #ignore full artwork image data
        user_info[key] = val
      end
    end
    user_info["playerState"] = `osascript -e 'tell app "Rdio" to get player state'`.strip
    user_info["source"] = "Rdio"
    print user_info.to_utf8.to_camelkeyed_json
  end
end

$stdout.sync = true

EM.run {
  EM.watch_distributed_notification('com.apple.iTunes.playerInfo', ITunesWatcher)
  EM.watch_distributed_notification('com.spotify.client.PlaybackStateChanged', SpotifyWatcher)
  EM.watch_distributed_notification('com.rdio.desktop.playStateChanged', RdioWatcher)
}
