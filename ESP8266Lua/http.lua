local http = {}
dobbie = require 'dobbie'
local srv = nil

function http.start(action)
    srv = net.createServer(net.TCP)
    print("starting http server on port 80")
    
    srv:listen(80, function(conn) 
        print("Recieving request")
                
        conn:on("sent", function(conn)
            if dobbie.fileTransfer.hasFile then
                dobbie.streamFile(conn,"sok.json",true)
            end
        end)
        
        conn:on("receive", function(conn, payload) 
            dobbie.handle(conn, payload);
            if dobbie.fileTransfer.hasFile == false then
                conn:close()
            end
        end)      
    end) 
end

function http.stop(action)
    if dobbie.fileTransfer.hasFile then
        if dobbie.fileTransfer.finished then
            srv:close();
            svr = nil;
            print("closing http server")
            tmr.stop(0)
            action()
        end
    elseif dobbie.masterConnection.ip ~= nil then
        srv:close();
        svr = nil;
        print("closing http server")
        tmr.stop(0)
        action()
    end
    collectgarbage()
end

return http