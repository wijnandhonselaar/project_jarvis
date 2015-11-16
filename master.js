var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var SOK = require('./models/SOK');
var dgram = require('dgram');
var http = require('http-request');

var supportedSOKVersions = ['0.0.1'];

server.listen(3221);

var devices =  {
    actuator:[],
    sensors:[]
};

function addToDeviceList(d) {
    if(devices[d.type].length != 0) {
        for (var i = 0; i < devices[d.type].length; i++) {
            if (devices[d.type][i].id !== d.id) {
                devices[d.type].push(d);
            }
        }
    } else {
        devices[d.type].push(d);
    }
}

listenForUDPPackets(function(msg, remote){

    if(supportedSOKVersions.indexOf(msg.version) !== -1){
        http.get('http://'+remote.address+'/sok', function (err, res) {
            if (err) {
                console.error(err);
                return;
            }
            var d = JSON.parse(res.buffer.toString());
            addToDeviceList(d);
            console.log(devices);
        });
    }
});



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

    udpserver.bind(3221);
}