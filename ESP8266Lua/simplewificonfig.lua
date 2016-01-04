local simplewificonfig = {}

function simplewificonfig.setupWifiMode(action)
    print("set up wifi mode")
    local settings = require 'wifi_settings'
    wifi.setmode(wifi.STATION)
    wifi.sta.config(settings.ssid, settings.password)
    
    wifi.sta.connect()
    tmr.alarm(1, 1000, 1, function()
        if wifi.sta.getip()== nil then
            print("IP unavaiable, Waiting...")
        else
            tmr.stop(1)
            print("Config done, IP is "..wifi.sta.getip())
            action()
        end
    end) 
end    

return simplewificonfig
