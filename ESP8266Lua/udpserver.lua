local udpserver = {}
local srv = nil;

function udpserver.broadcast(msg)
     if msg == nil then
        msg = '{"type":"SOK","version":"0.0.1"}'
     end
     srv=net.createConnection(net.UDP,0);
     srv:connect(3221, "255.255.255.255");
     print("Broadcasting");
     srv:send(msg);
     srv:close();
end

return udpserver;
