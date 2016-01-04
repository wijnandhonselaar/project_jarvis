var expect              = require('chai').expect;
var api                 = require('superagent');
var Sensor              = require('../models/sensor');
var Actuator            = require('../models/actuator');
var thinky = require('thinky')();
var r = thinky.r;
var connection = null;


describe('Device routing', function() {

    require('./globalBefore');

    before(function (done) {
        var device = newDevice(1000015, 'a');
        device.type = 'sensor';

        api.post('http://localhost:3221/test/devices/add')
        .send({device : device, remote:{address:'192.186.24.1'}})
        .end(function (err, res) {
            if (err) {
                done(err);
            }
            done();
        });
    });
    before(function (done) {
        device = newDevice(1000016, 'b');
        device.type = 'actuator';
        api.post('http://localhost:3221/test/devices/add')
            .send({device : device, remote:{address:'192.186.24.2'}})
            .end(function (err, res) {
                if (err) {
                    done(err);
                }
                done();
            });
    });

    beforeEach(function(done){
        setTimeout(function() {
            done();
        }, 500);
    });

    describe('#get all devices', function() {
        it('should receive a list of devices', function (done) {
            api
            .get('http://localhost:3221/devices')
                //.expect(200) //Status code
                .end(function(err,res) {
                    if (err) {
                        done(err);
                    }
                    expect(res.body.devices.actuators.length).to.equal(1);
                    expect(res.body.devices.actuators[0].config.alias).to.equal('b');
                    expect(res.body.devices.sensors.length).to.equal(1);
                    done();
                });
        });
    });

    describe('#get all sensors', function () {
        it('should receive list of sensors', function (done) {
            api
                .get('http://localhost:3221/devices/sensors')
                .end(function(err,res) {
                    if (err) {
                        done(err);
                    }
                    expect(res.body.sensors[0].id).to.be.equal(1000015);
                    expect(res.body.sensors.length).to.equal(1);
                    done();
                });
        });
    });

    describe('#get all actuators', function () {
        it('should receive a list of actuators', function (done) {
            api
                .get('http://localhost:3221/devices/actuators')
                //.send()
                //.expect(200) //Status code
                .end(function(err,res) {
                    if (err) {
                        done(err);
                    }
                    expect(res.body.actuators[0].id).to.be.equal(1000016);
                    expect(res.body.actuators.length).to.be.equal(1);
                    done();
                });
        });
    });

    describe('#Change an alias', function () {
        it('should change the alias of a sensor', function (done) {
            api
                .put('http://localhost:3221/devices/sensors/1000015/alias')
                .send({alias: 'nieuw'})
                .end(function(err,res) {
                    if (err) {
                        done(err);
                    }
                    expect(JSON.parse(res.text).success).to.be.equal("Success, alias for 1000015 was successfully updated.");
                    done();
                });
        });

        it('should change the alias of a actuator', function (done) {
            api
                .put('http://localhost:3221/devices/actuators/1000016/alias')
                .send({alias: 'nieuw'})
                .end(function(err,res) {
                    if (err) {
                        done(err);
                    }
                    expect(JSON.parse(res.text).success).to.be.equal("Success, alias for 1000016 was successfully updated.");
                    done();
                });
        });
    });

    describe('#Change an clientIntervalTimer', function () {
        it('should change the timer of a sensor', function (done) {
            api
                .put('http://localhost:3221/devices/sensors/1000015/interval')
                .send({interval: 18})
                .end(function(err,res) {
                    //console.log(err);
                    //console.log(res);
                    if (err) {
                        done(err);
                    }
                    expect(JSON.parse(res.text).success).to.be.equal("Success, interval for 1000015 was successfully updated.");
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
        }).error(function(err) {
            done(err);
        });
    });

    after(function(done){
        var id= 1000016;
        Actuator.get(id).then(function(actuator) {
            actuator.delete().then(function() {
                done();
            }).error(function(err) {
                done(err);
            });
        });
    });

    after(function(done){
        api
        .post("http://localhost:3221/test/devices/delete")
        .end(function(err,res) {
            if (err) {
                done(err);
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
            savedAt: 1651981981,
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