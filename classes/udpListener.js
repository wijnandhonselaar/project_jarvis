/**
  * Functie welke luistert naar UDP broadcasts van andere apparaten binnen het netwerk (Slave devices)
  * @param callback, callback functie met een geparsed json gebricht als argument
 */

var PORT = 3221;

function listenForUDPPackets(callback){
    var udpserver = dgram.createSocket("udp4");
    udpserver.on('listening', function () {
        var address = server.address();
        console.log('UDP Server listening on ' + address.address + ":" + address.port);
    });

    udpserver.on('message', function (message, remote) {
        callback(JSON.parse(message), remote);
        console.log(remote.address + ':' + remote.port +' - ' + message);
    });

    udpserver.bind(PORT);
}



module.exports = listenForUDPPackets