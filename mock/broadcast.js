/* jshint ignore:start */
var config = require('./config');
var dgram = require('dgram');

var broadcastInterval = setInterval(broadcastUDPPacket, config.broadcastTime);
var index = 0;

function broadcastUDPPacket() {
    var broadcastObject = {
        type: 'SOK',
        version: '0.0.1'
    };

    var broadcastAddress = config.broadcastAddress;
    var message = new Buffer(JSON.stringify(broadcastObject));
    var client = dgram.createSocket("udp4");
    client.bind();
    client.on("listening", function () {
        client.setBroadcast(true);
        if (index < (config.numberOfSensors + config.numberOfActuators)) {
            client.send(message, 0, message.length, config.UDPPORT, broadcastAddress, function (err, bytes) {
                index ++;
                client.close();
            });
        }
    });
}
/* jshint ignore:end */