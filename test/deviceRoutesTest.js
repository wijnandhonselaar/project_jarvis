var expect              = require('chai').expect;
var should              = require('should');
var request             = require('supertest');
var api                 = request('http://localhost:3000');
var Sensor              = require('../models/sensor');
var deviceManager       = require('../modules/deviceManager');
var dgram               = require('dgram');
var io                  = null;

describe('Device routing', function() {

    // Add sensors
    before(function (done) {
        io = dgram.createSocket("udp4");
        var device = newDevice(123, 'philips temp sensor', 'woonkamer thermometer');
        device.type = 'sensor';
        deviceManager.add(device, '192.168.0.45', io);
        device = newDevice(3286, 'philips lumen sensor', 'woonkamer, is het al donker?');
        device.type = 'actuator';
        deviceManager.add(device, '192.168.0.46', io);
        done();
    });

    describe('#get all devices', function() {
        it('should receive a list of devices', function (done) {
            api
                .get('/api/v1/devices')
                .send()
                .expect(200) //Status code
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.body.devices.length).to.be.above(1);
                    done();
                });
        });
    });

    describe('#get all sensors', function () {
        it('should receive list of sensors', function (done) {
            api
                .get('/api/v1/devices/sensors')
                .send()
                .expect(200) //Status code
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.body.sensors[0].id).to.be.equal(123);
                    expect(res.body.sensors.length).to.be.above(1);
                    done();
                });
        });
    });

    describe('#get all actuators', function () {
        it('should receive a list of actuators', function (done) {
            api
                .get('/api/v1/devices/actuators')
                .send()
                .expect(200) //Status code
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.body.actuators[0].id).to.be.equal(3286);
                    expect(res.body.actuators.length).to.be.above(1);
                    done();
                });
        });
    });

    describe('#updateAliasForDevice', function () {
        it('Update an alias for a device', function (done) {
            api
                .get('/api/v1/devices/actuators')
                .send()
                .expect(200) //Status code
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.body.actuators[0].id).to.be.equal(3286);
                    expect(res.body.actuators.length).to.be.above(1);
                    done();
                });
        });
    });

    after(function (done) {
        done();
    });
});

function newDevice(id, name, alias) {
    return new Sensor({
        id: id,
        config:{alias: alias},
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