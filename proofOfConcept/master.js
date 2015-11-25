var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var dgram = require('dgram');
var http = require('superagent');
var supportedSOKVersions = ['0.0.1'];

server.listen(3221);

var httpPending = [];
var devices =  {
    actuators:[],
    sensors:[]
};

app.get('/deviceManager', function(req,res){
    res.json(devices);
});

app.use(express.static(path.join(__dirname, 'public')));

//io.on("connection", function(socket) {
//    setTimeout(function(){
//        deviceManager.actuators.push({
//            test: "shizzle"
//        });
//        io.emit("event", {event: "deviceschanged"});
//    }, 5000);
//});

function addToDeviceList(d,remote) {
    if(devices[d.type].length !== 0) {
        for(var i = 0; i<devices[d.type].length; i++){

            var exists = false;

            if(devices[d.type][i].id === d.id){
                exists = true;
            }
        }

        if(!exists){
            devices[d.type].push(d);
            io.emit("event", {event: "deviceschanged"});
            console.log("Discovered "+ d.name + " on "+remote.address+ ' length: '+devices[d.type].length);
        }

    } else {
        devices[d.type].push(d);
        io.emit("event", {event: "deviceschanged"});
        console.log("Discovered "+ d.name + " on "+remote.address+ ' length: '+devices[d.type].length);
    }
}

function getDeviceByIPAddress(ip){
    for (var property in devices) {
        if (object.hasOwnProperty(property)) {
            for(var i = 0; i<devices[property].length; i++){
                if(devices[property][i].ip == ip){
                    return devices[property][i];
                }
            }
        }
    }
    return null;
}

listenForUDPPackets(function(msg, remote){
    if(supportedSOKVersions.indexOf(msg.version) !== -1){
        if(!httpPending[remote.address] || httpPending[remote.address] == undefined && getDeviceByIPAddress(remote.address)) {
            http
                .get('http://' + remote.address + '/sok')
                .end(function (err, res) {
                    var msg = JSON.parse(res.text);
                    msg.ip = remote.address;
                    addToDeviceList(msg, remote);
                    httpPending[remote.address] = false;
                });
        }
        httpPending[remote.address] = true;
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
