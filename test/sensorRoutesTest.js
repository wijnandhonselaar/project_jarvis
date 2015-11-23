var expect              = require('chai').expect;
var should              = require('should');
var request             = require('supertest');
var api                 = request('http://localhost:3000');
var Sensor              = require('../models/sensor');
var devices             = require('./devices');
var sensorManager       = require('./sensorManager');
var dgram               = require('dgram');
var io                  = null;

describe('Sensor routing', function() {

    // Add sensors
    before(function (done) {
        io = dgram.createSocket("udp4");
        var device = newSensor(123, 'philips temp sensor', 'woonkamer thermometer');
        device.type = 'sensor';
        devices.add(device, '192.168.0.45', io);
        device = newSensor(3286, 'philips lumen sensor', 'woonkamer, is het al donker?');
        device.type = 'sensor';
        devices.add(device, '192.168.0.45', io);
        done();
    });

    describe('#get all sensors', function () {
        it('should receive list of sensors', function (done) {
            api
                .get('/api/v1/sensors')
                .send()
                .expect(200) //Status code
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.body.sensors.length).to.be.above(1);
                    done();
                });
        });
    });

    after(function (done) {
        sensorManager.sensors = [];
        done();
    });
});

function newSensor(id, name, alias) {
    return new Sensor({
        id: id,
        alias: alias,
        name: name,
        sokVersion: 0.11,
        description: 'Temperatuur op 0.1c nauwkeuring',
        commands: [{
            name: 'get temperature',
            parameters: ["para", "meter"],
            requestInterval: 5000,
            httpMethod: "GET",
            returns: {
                Celsius: 'number',
                Fahrenheit: 'number',
                Kelvin: 'number'
            },
            description: "geeft de temperatuur"
        }]
    });
}