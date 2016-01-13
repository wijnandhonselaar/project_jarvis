var dgram = require('dgram');
var broadcastAddress = "255.255.255.255";
var message = new Buffer('{"id":1337,"msg":"Klaaar","key":"koffie is klaar","severity":1}');
var client = dgram.createSocket("udp4");
client.bind();
client.on("listening", function () {
    client.setBroadcast(true);
    client.send(message, 0, message.length, 3221, broadcastAddress, function (err, bytes) {
        client.close();
    });

});
