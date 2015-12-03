local webhook = {}
local counter = 0
function webhook.init(dobbie, action)  
    tmr.alarm(0, 5000, 1, function() 
        if counter == 4 then
            action(true, webhook.getMessage())
        end
        counter = counter + 1
    end)
end


function webhook.getMessage()
    data = 'id=1337&msg=Koffie is klaar&key=onFinish&severity=5'
    request = "POST sensorMelding HTTP/1.1\r\n"..
      "Host: example.com\r\n"..
      "Cache-Control: no-cache\r\n"..
      "Content-Type: application/x-www-form-urlencoded\r\n\r\n"..data
    return request
end

return webhook;
    