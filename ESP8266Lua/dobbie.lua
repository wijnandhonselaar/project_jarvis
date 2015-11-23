local dobbie = {}
local json = require "cjson"
local handshakePin = 4;
--gpio.mode(handshakePin, gpio.OUTPUT)
--gpio.write(handshakePin, gpio.LOW)

dobbie.httpRequests = {
    GET = {
        sok = function()
            file.open("sok.json", "r")
            sokdefinition = file.read();
            file.close();
            print("Sending sok definition...")
--            gpio.mode(handshakePin, gpio.OUTPUT)
--            gpio.write(handshakePin, gpio.HIGH)
            return sokdefinition
        end
    }
}

function dobbie.handle(conn,request)
    http_method = getHttpMethod(request)
    requestHandle = getRequestHandle(request)
    print(http_method.. "/" .. getRequestHandle(request))
    if dobbie.httpRequests[http_method] ~= nil then
        if dobbie.httpRequests[http_method][requestHandle] ~= nil then
            message = dobbie.httpRequests[http_method][requestHandle]()
        else
            message = "Route does not exist"
        end
    else
        message = "HTTP method not supported"    
    end
    
    conn:send("HTTP/1.1 200 OK\r\n")
--    conn:send("Content-Type: application/json\r\n")
--    conn:send("Content-Type: text/html\r\n")
    conn:send("Content-Length: " .. tostring(string.len(message)) .. "\r\n")
    conn:send("Connection: close\r\n")
    conn:send("\r\n" .. message .. "\r\n")
    conn:close()
    request = nil
    collectgarbage()
end    

function getHttpMethod(request)
    if string.find(request,"GET") ~= nil then  
        first,last = string.find(request,"GET");  
    elseif string.find(request,"POST") ~= nil then  
        first,last = string.find(request,"POST");   
    end
    return string.sub(request, first , last)
end

function getRequestHandle(request)
    -- Find start
    local e = string.find(request, "/")
    local request_handle = string.sub(request, e + 1)

    -- Cut end
    e = string.find(request_handle, "HTTP")
    request_handle = string.sub(request_handle, 0, (e-2))
   
    return request_handle
end


function mysplit(inputstr, sep)
        if sep == nil then
                sep = "%s"
        end
        local t={} ; i=1
        for str in string.gmatch(inputstr, "([^"..sep.."]+)") do
                t[i] = str
                i = i + 1
        end
        return t
end


return dobbie
