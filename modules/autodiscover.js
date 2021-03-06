/*jslint node: true */
"use strict";
var supportedSOKVersions = ['0.0.1'];
var httpPending = [];
var dgram = require('dgram');
var http = require('superagent');
var deviceManager = require('./deviceManager');
var io = null;
var server = null;

/**
 * Functie welke luistert naar UDP broadcasts van andere apparaten binnen het netwerk (Slave deviceManager)
 * @param callback, callback functie met een geparsed json gebricht als argument
 */
function listenForUDPPackets(callback) {
    var udpserver = dgram.createSocket("udp4");

    udpserver.on('listening', function () {
        var address = server.address();
        if (GLOBAL.logToConsole) console.log('UDP Server listening on ' + address.address + ":" + address.port);
    });

    udpserver.on('message', function (message, remote) {
        callback(JSON.parse(message), remote);
        if (GLOBAL.logToConsole) console.log(remote.address + ':' + remote.port + ' - ' + message);
    });

    udpserver.bind(GLOBAL.port);
}

module.exports = {
    init: function (svr, socket) {
        io = socket;
        server = svr;
        listenForUDPPackets(function (msg, remote) {
            if("id" in msg && "msg" in msg && "key" in msg && "severity" in msg){
                deviceManager.broadcastEvent(msg);
            } else if (supportedSOKVersions.indexOf(msg.version) !== -1) {
                if (!httpPending[remote.address] || httpPending[remote.address] === undefined && deviceManager.getByIP(remote.address)) {
                    http
                        .get('http://' + remote.address + '/sok')
                        .end(function (err, res) {
                            var msg = JSON.parse(res.text);
                            if(GLOBAL.logToConsole) console.log(msg.name + 'found');
                            deviceManager.add(msg, remote);
                            httpPending[remote.address] = false;
                        });
                }
                httpPending[remote.address] = true;
            }
        });
    },
    getDevices: function(){return deviceManager.get();}
};