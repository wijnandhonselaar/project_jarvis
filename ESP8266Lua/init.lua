tmr.delay(10000)

function unrequire(m)
    package.loaded[m] = nil
    _G[m] = nil
end

local simplewifisettings = require 'simplewificonfig'
local udpserver = require 'udpserver'
local http = require 'http'

simplewifisettings.setupWifiMode( function() 
    udpserver.broadcast()   
    unrequire('udpserver')
    http.start()
    tmr.alarm(0, 15000, 1, function() 
       http.stop(function()
            udpserver.broadcast('{"id":1337,"msg":"koffiezetapparaat is klaar","key":"onFinish","severity":5}')
--            http.start()
        end)
    end)
end)
