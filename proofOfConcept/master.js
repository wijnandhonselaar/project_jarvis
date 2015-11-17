var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var SOK = require('./../models/SOK');
var dgram = require('dgram');
var http = require('superagent');
var supportedSOKVersions = ['0.0.1'];

server.listen(3221);

var httpPending = [];
var devices =  {
    actuator:[],
    sensor:[]
};

function addToDeviceList(d,remote) {
    //console.log(d.type);
    if(devices[d.type].length !== 0) {

         for(var i = 0; i<devices[d.type].length; i++){
             var exists = false;
             if(devices[d.type].id === d.type){
                 exists = true;
             }
         }

        if(!exists){
            devices[d.type].push(d);
            console.log("Discovered "+ d.name + " on "+remote.address+ ' length: '+devices[d.type].length);
        }

    } else {
        devices[d.type].push(d);
        console.log("Discovered "+ d.name + " on "+remote.address+ ' length: '+devices[d.type].length);
    }
}

listenForUDPPackets(function(msg, remote){
    if(supportedSOKVersions.indexOf(msg.version) !== -1){
        if(!httpPending[remote.address] || httpPending[remote.address] == undefined) {
            http
                .get('http://' + remote.address + '/sok')
                .end(function (err, res) {
                    addToDeviceList(res.body, remote);
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
        //console.log(remote.address + ':' + remote.port +' - ' + message);
    });

    udpserver.bind(3221);
}