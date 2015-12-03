tmr.delay(10000)

local simplewifisettings = require 'simplewificonfig'
local udpserver = require 'udpserver'
local http = require 'http'

simplewifisettings.setupWifiMode( function() 
    udpserver.broadcast()   
    http.start()
    dobbie.udp = udpserver
end)
