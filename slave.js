var express = require('express');
var app = express();
var server = require('http').Server(app);
var SOK = require('./models/SOK');
var dgram = require('dgram');
var os = require('os');
var ifaces = os.networkInterfaces();

var retrievedSock = false;

server.listen(80);


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('public'));

var broadcastInterval = setInterval(broadcastUDPPacket,5000);

app.get('/', function (req, res) {
    res.sendfile(__dirname+'/public/index.html');
});

app.get('/sok',function(req,res){
    retrievedSock = true;
    clearInterval(broadcastInterval);
    res.json(SOK[0]);
});

app.post('/on',function(req,res){
    console.log('on');
    res.send('');
});

app.post('/off',function(req,res){
    console.log('off');
    res.send('');
});


function broadcastUDPPacket(){
    var broadcastObject = {
        type:'SOK',
        version:'0.0.1'
    };
    var broadcastAddress = "255.255.255.255";
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

