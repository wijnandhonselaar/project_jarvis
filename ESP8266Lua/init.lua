function unrequire(m)
    package.loaded[m] = nil
    _G[m] = nil
end

simplewifisettings = require 'simplewificonfig'
dobbie = require 'dobbie'

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
    conn:on("receive",function(conn, request) 
        dobbie.handle(conn,request);
        end) 
    end)
end)
   