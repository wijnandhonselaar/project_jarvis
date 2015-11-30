var expect              = require('chai').expect;
var api                 = require('superagent');
var Sensor              = require('../models/sensor');
var Actuator            = require('../models/actuator');
var logger              = require('../modules/logger');

describe('Logging', function() {

    before(function (done) {

        var device = newDevice(1000015, 'a');
        device.type = 'sensor';

        api.post('http://localhost:3221/test/devices/add')
            .send({device : device, remote:{address:'192.186.24.1'}})
            .end(function (err, res) {
                if (err) { throw err;}
            });

        device = newDevice(1000016, 'b');
        device.type = 'actuator';
        api.post('http://localhost:3221/test/devices/add')
            .send({device : device, remote:{address:'192.186.24.2'}})
            .end(function (err, res) {
                if (err) { throw err;}
                done();
            });
    });

    beforeEach(function(done){
        setTimeout(function() {
            done();
        }, 500);
    });


    describe('#Log to database', function() {
        it('should log new data.', function(done) {
            logger.log(1000015, 'sensor', {message: 'message'}, 1, function(err,res) {
                if(err) { throw err; }
            });
            done();
        });
    });

    describe('#Get all sensor logs', function() {
        it('should get all sensor logs', function (done) {
            logger.getSensors(function(err,res) {
                if(err) throw err;
                done();
            });
        });
    });

    describe('#Get all actuator logs', function() {
        it('should get all actuator logs', function (done) {
            logger.getActuators(function(err,res) {
                if(err) throw err;
                done();
            });
        });
    });

    describe('#Get all logs for a specific device', function() {
        it('should get all actuator logs', function (done) {
            logger.get(1000015, function(err,res) {
                if(err) throw err;
                expect(res[0].type).to.equal('sensor');
                done();
            });
        });
    });

    after(function (done) {
        var id= 1000015;
        Sensor.get(id).then(function(sensor) {
            sensor.delete().then(function() {
                done();
            });
        }).error();
    });

    after(function(done){
        var id= 1000016;
        Actuator.get(id).then(function(actuator) {
            actuator.delete().then(function() {
                done();
            }).error();
        });
    });

    after(function(done){
        api
            .post("http://localhost:3221/test/devices/delete")
            .end(function(err,res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });
});

function newDevice(id, name ) {
    return {id: id,
        name: name,
        sokVersion: 1,
        description: 'Temperatuur op 0.1c nauwkeuring',
        image: "niks",
        commands: {
            status:{
                name: 'c',
                parameters:{},
                requestInterval: 5000,
                returns: {
                    Celsius: 'number',
                    Fahrenheit: 'number',
                    Kelvin: 'number'
                },
                description: "geeft de temperatuur"
            },
            on:{
                name: 'c',
                parameters:{},
                requestInterval: 5000,
                returns: {
                    Celsius: 'number',
                    Fahrenheit: 'number',
                    Kelvin: 'number'
                },
                description: "geeft de temperatuur"
            },
            off:{
                name: 'c',
                parameters:{},
                requestInterval: 5000,
                returns: {
                    Celsius: 'number',
                    Fahrenheit: 'number',
                    Kelvin: 'number'
                },
                description: "geeft de temperatuur"
            }
        }
    }
}