var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var dgram = require('dgram');
var http = require('superagent');
var supportedSOKVersions = ['0.0.1'];
var index = 0;

server.listen(80);

var devices =  {
    actuators:[],
    sensors:[]
};

//create 30 actuators and 30 sensors
for (var i = 0; i < 30; i++) {
        if(i < 30){
            devices.actuators.push(createDevice("actuators", i));
        }
        else{
            devices.sensors.push(createDevice("sensors", i));
        }
};

//broadcast ik ben hier elke 5 sec
var broadcastInterval = setInterval(broadcastUDPPacket,1000);
function broadcastUDPPacket(){
    var broadcastObject = {
        type:'SOK',
        version:'0.0.1'
    };

    var broadcastAddress = "0.0.0.0";
    //var broadcastAddress = "255.255.255.255";
    var message = new Buffer(JSON.stringify(broadcastObject));
    var client = dgram.createSocket("udp4");
    client.bind();
    client.on("listening", function () {
        client.setBroadcast(true);
        client.send(message, 0, message.length, 3221, broadcastAddress, function(err, bytes) {
            client.close();
        });
    });
}

//send all devices at once
 app.get('/sok', function(req,res){
    console.log(index);
    if(index == 30){
        index = 0;
    }
    if(index < 30){
        console.log(devices.actuators[index]);
        res.send(JSON.stringify(devices.actuators[index]));
        index ++;
    }
    else if(index < 60){
        res.send(JSON.stringify(devices.sensors[index]));
        index ++;
    }
});

function createDevice(deviceType, id){
    kind = detemineKind(id);

    device = {
        id: id,
        name: kind.name,
        type: deviceType,
        sokVersion: 0.1,
        description: kind.name + ' is een geweldige ' + deviceType + ' die bijvoorbeeld het commando ' + kind.commands.on.name + ' kan uitvoeren!',
        commands: kind.commands
    }

    return device;
}

function detemineKind(id){
    if(id < 5){
        var kind ={};
        kind.name = 'Lamp ' + (id+1);
        kind.commands = {
            on:{
                name: 'on',
                parameters: [],
                requestInterval: 5000,
                httpMethod: 'POST',
                returns: 'Boolean',
                description: kind.name +' will be turned on'
            },
            off:{
                name : 'off',
                parameters: [],
                requestInterval: 5000,
                httpMethod: 'POST',
                returns: 'Boolean',
                description: kind.name +' will be turned off'
            },
            changeIntensity:{
                    name: 'change intensity',
                    parameters: [],
                    requestInterval: 5000,
                    httpMethod: 'POST',
                    returns: 'Boolean',
                    description: kind.name + ' will change intensity'
                    },
            status:    {
                    name : 'status',
                    parameters: [],
                    requestInterval: 5000,
                    httpMethod: 'GET',
                    returns: {
                        intensity: 'number',
                    },
                    description: 'Retrieves status of ' + kind.name
                }   
        }
    }

    else if(id < 10){
        var kind ={}
        kind.name = 'Rolluik ' + (id-4)
        kind.commands = {
            status:{
                name : 'status',
                parameters: [],
                requestInterval: 5000,
                httpMethod: 'GET',
                returns: {
                    open: 'boolean',
                    closed: 'boolean'
                },
                description: 'Retrieves status of ' + kind.name
            },
            on:getOpenCommand(kind.name),
            off: getCloseCommand(kind.name)
        }
    }

    else if(id < 15){
        var kind ={}
        kind.name = 'Raam ' + (id-9)
        kind.commands = {
            status:{
                name : 'status',
                parameters: [],
                requestInterval: 5000,
                httpMethod: 'GET',
                returns: {
                    open: 'boolean',
                    closed: 'boolean'
                },
                description: 'Retrieves status of ' + kind.name
            },
            on:getOpenCommand(kind.name),
            off: getCloseCommand(kind.name)
        }
    }

    else if(id < 20){
        var kind ={}
        kind.name = 'Verwarming ' + (id-14)
        kind.commands = {
            status:{
                name : 'status',
                parameters: [],
                requestInterval: 5000,
                httpMethod: 'GET',
                returns: {
                    open: 'boolean',
                    closed: 'boolean'
                },
                description: 'Retrieves status of ' + kind.name
            },
            on:getOpenCommand(kind.name),
            off: getCloseCommand(kind.name)
        }
    }

    else if(id < 25){        
        var kind ={}
        kind.name = 'Tv ' + (id-19)
        kind.commands = {
            on:{
                name: 'on',
                parameters: [],
                requestInterval: 5000,
                httpMethod: 'POST',
                returns: 'Boolean',
                description: kind.name +' will be turned on'
            },
            off:{
                name : 'off',
                parameters: [],
                requestInterval: 5000,
                httpMethod: 'POST',
                returns: 'Boolean',
                description: kind.name +' will be turned off'
            },
            status:{
                name : 'status',
                parameters: [],
                requestInterval: 5000,
                httpMethod: 'GET',
                returns: {
                    on: 'boolean',
                    off: 'boolean'
                },
                description: 'Retrieves status of ' + kind.name
            }
        }
    }

    else if(id < 30){
        var kind ={}
        kind.name = 'Deurslot ' + (id-24)
        kind.commands = {
            status:{
                name : 'status',
                parameters: [],
                requestInterval: 5000,
                httpMethod: 'GET',
                returns: {
                    open: 'boolean',
                    closed: 'boolean'
                },
                description: 'Retrieves status of ' + kind.name
            },
            on:getOpenCommand(kind.name),
            off: getCloseCommand(kind.name)
        }
    }
    return kind;
}

function getOpenCommand(name){
    return {
                name: 'Open',
                parameters: [],
                requestInterval: 5000,
                httpMethod: 'POST',
                returns: 'Boolean',
                description: name + ' will open'
            };
}

function getCloseCommand(name){
    return {
                name: 'Close',
                parameters: [],
                requestInterval: 5000,
                httpMethod: 'POST',
                returns: 'Boolean',
                description: name + ' will close'
            };
}
