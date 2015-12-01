function unrequire(m)
    package.loaded[m] = nil
    _G[m] = nil
end

simplewifisettings = require 'simplewificonfig'
dobbie = require 'dobbie'
webhook = require 'webhookmanager'

simplewifisettings.setupWifiMode( function() 

    srv = nil;   
    srv=net.createConnection(net.UDP,0);
    srv:connect(3221, "255.255.255.255");
    print("Broadcasting");
    srv:send('{"type":"SOK","version":"0.0.1"}');
    srv:close();
    srv = nil;

    srv=net.createServer(net.TCP)
    print("Now listening on port 80"); 
    srv:listen(80,function(conn) 
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

    webhook.init(dobbie, function(postToWebhook, postdata)
        if postToWebhook then
             if dobbie.masterConnection.ip ~= nil then
                if dobbie.masterConnection.connected == false then
                    srv:close();
                    srv = nil;
                    srv = net.createConnection(net.TCP,0)   
                    print('attemping to connect to webhook');
                    srv:connect(3221, dobbie.masterConnection.ip)
                    srv:on("connection",function(obj) 
                    dobbie.masterConnection.connected = true
                       print('connected to master');
                    end)
                end 
            end
        end
    end)    
    
end)
   
