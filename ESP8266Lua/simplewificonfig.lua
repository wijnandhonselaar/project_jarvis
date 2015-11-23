local simplewificonfig = {}
local json = require "cjson"

function simplewificonfig.setupWifiMode(action)
    print("set up wifi mode")
    file.open("wifi_settings.json", "r")
    settings = json.decode(file.read());
    file.close();
    collectgarbage();
    wifi.setmode(wifi.STATION)
    wifi.sta.config(settings.ssid,settings.password)
    
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
