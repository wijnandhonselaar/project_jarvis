var expect              = require('chai').expect;
var request             = require('supertest');
var api                 = request('http://localhost:3221');
var Sensor              = require('../models/sensor');
var deviceManager       = require('../modules/deviceManager');
var io                  = {};

describe('Device routing', function() {

    // Add sensors
    before(function (done) {
        io.emit = function(){};
        deviceManager.init(io);
        var device = newDevice(123, 'a', 'woonkamer thermometer');
        device.type = 'sensors';
        deviceManager.add(device, '192.168.0.45');
        device = newDevice(3286, 'b', 'woonkamer, lamp');
        device.type = 'actuators';
        deviceManager.add(device, '192.168.0.46');
        done();
    });

    beforeEach(function (done) {
        done();
    });

    describe('#get all devices', function() {
        it('should receive a list of devices', function (done) {
            api
                .get('/devices')
                .send()
                .expect(200) //Status code
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    console.log(res.body);
                    //expect(res.body.devices.length).to.equal(2);
                    done();
                });
        });
    });

    describe('#get all sensors', function () {
        it('should receive list of sensors', function (done) {
            api
                .get('/devices/sensors')
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
                .get('/devices/actuators')
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
                .get('/devices/actuators')
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
            name: 'c',
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