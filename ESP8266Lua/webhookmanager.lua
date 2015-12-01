local webhook = {}
local counter = 0
function webhook.init(dobbie, action)  
    tmr.alarm(0, 5000, 1, function() 
        if counter == 2 then
            action(true,"")
        end
        counter = counter + 1
    end)
end

return webhook;
    