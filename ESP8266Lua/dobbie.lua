local dobbie = {}
globalmethods = require 'globalmethods'
dobbie.headersHaveBeenSent = false
dobbie.fileTransfer = {
    hasFile = false,
    fileSize = 0,
    filePosition = 0,
    bytesSent = 0,
    finished = false
}

dobbie.masterConnection = {
    connected = false,
    ip = nil
}

dobbie.httpRequests = require 'routes'

function dobbie.setEventTimer()
    tmr.alarm(0, 30000, 0, function() 
        dobbie.udp.broadcast('{"id":1337,"msg":"koffiezetapparaat is klaar","key":"onFinish","severity":5}')
    end)
end

function dobbie.handle(conn,request)
    http_method = getHttpMethod(request)
     if http_method == "POST" then
        postParams = setPostParams(request)
     end
    requestHandle = getRequestHandle(request)
    print(http_method.. "/" .. getRequestHandle(request))
    if dobbie.httpRequests[http_method] ~= nil then
        if dobbie.httpRequests[http_method][requestHandle] ~= nil then
            message = dobbie.httpRequests[http_method][requestHandle](conn, postParams)
            if message == nil then
                message = "No response given"
            end
        else
            message = "Route does not exist check HTTP method"
        end
    else
        message = "HTTP method not supported"
    end      
     if dobbie.fileTransfer.hasFile == false then
        send(conn, message, string.len(tostring(message)))
        dobbie.headersHaveBeenSent = false
     end

     if dobbie.masterConnection.ip == nil then
        dobbie.masterConnection.ip = conn:getpeer();
     end
     request = nil
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

function setPostParams(request)
      body = globalmethods.explode(request, "\n\r\n\r")
      postParameters = {}
      if body[13] ~= nil then
        bodyParam = globalmethods.explode(body[13], "&")
        for i=1,table.maxn(bodyParam)
            do 
            keyPairValue = globalmethods.explode(bodyParam[i], "=")
            s1 = tostring(keyPairValue[1])
            s2 = tostring(keyPairValue[2])
            postParameters[s1] = s2
        end  
    end
    return postParameters  
end


function dobbie.streamFile(conn, filename, seek)
    if file.open(filename, "r") then
        length = 0
        if seek then
             if dobbie.fileTransfer.bytesSent >= dobbie.fileTransfer.fileSize then
                dobbie.fileTransfer.finished = true
                dobbie.fileTransfer.hasFile = false
                dobbie.fileTransfer.bytesSent = 0
                dobbie.fileTransfer.filePosition = 0
                dobbie.headersHaveBeenSent = false
                conn:close()
                collectgarbage()
                return
            else
                file.seek("set", dobbie.fileTransfer.filePosition);
            end
        end
        repeat
            local line= file.read(512)
            if line then 
                if length < 2560 then
          
                    length = length + string.len(tostring(line))
                    dobbie.fileTransfer.bytesSent = dobbie.fileTransfer.bytesSent + 512
                    dobbie.fileTransfer.filePosition = dobbie.fileTransfer.bytesSent
                    print(dobbie.fileTransfer.bytesSent);
                   
                    send(conn, line)
                end 
            end
        until not line    
        file.close()
    end
end

function send(conn, message, length)
    if dobbie.headersHaveBeenSent == false then
        print("sending headers")
        conn:send("HTTP/1.1 200 OK\r\n\r\n")
--      conn:send("Content-Type: application/json\r\n")
--      conn:send("Content-Type: text/html\r\n")    
--      conn:send("Content-Length: ".. tostring(length) .."\r\n\r\n")
--      conn:send("Keep-Alive: timeout=15, max=100\r\n\r\n")
        dobbie.headersHaveBeenSent = true
    end
    if message ~= nil then
        conn:send(message)
    end
end

function dobbie.resetFilePos()
    dobbie.fileTransfer.filePosition = 0;
end

return dobbie
