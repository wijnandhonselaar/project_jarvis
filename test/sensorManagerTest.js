var expect              = require('chai').expect;
var should              = require('should');
var request             = require('supertest');
var Sensor              = require('../models/sensor');
var devices             = require('./devices');
var sensorManager       = require('./sensorManager');
var dgram               = require('dgram');
var io                  = null;

describe('Sensor manager', function() {
    before(function (done) {
        io = dgram.createSocket("udp4");
        done();
    });

    describe('#Add sensor', function () {
        it('should add a sensor to the list of sensors', function (done) {
            var device = newSensor(123, 'philips temp sensor', 'woonkamer thermometer');
            device.type = 'sensor';
            devices.add(device, '192.168.0.45', io);
            expect(sensorManager.getAll().length).to.equal(1);
            done();
        });
    });

    describe('#Get all sensors', function () {
        it('should return a list of all sensors', function (done) {
            var sensors = sensorManager.getAll();
            expect(sensors.length).to.equal(1);
            done();
        })
    });

    after(function (done) {
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