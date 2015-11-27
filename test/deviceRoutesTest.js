var expect              = require('chai').expect;
var api                 = require('superagent')

describe('Device routing', function() {

    before(function (done) {
        var device = newDevice(123, 'a');
        device.type = 'sensor';

        api.post('http://localhost:3221/test/devices/add')
        .send({device : device, remote:{address:'192.186.24.1'}})
        .end(function (err, res) {
            if (err) { throw err;}
            console.log("oke");
        });

        device = newDevice(3286, 'b');
        device.type = 'actuator';
        api.post('http://localhost:3221/test/devices/add')
        .send({device : device, remote:{address:'192.186.24.2'}})
        .end(function (err, res) {
            if (err) { throw err;}
            console.log("oke");
        })

        done();
    });

    describe('#get all devices', function() {
        it('should receive a list of devices', function (done) {
            api
            .get('http://localhost:3221/devices')
                //.expect(200) //Status code
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.body.devices.actuators.length).to.equal(1);
                    expect(res.body.devices.actuators[0].config.alias).to.equal('');
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
                        throw err;
                    }
                    expect(res.body.sensors[0].id).to.be.equal(123);
                    expect(res.body.sensors[0].config.alias).to.equal('');
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
                        throw err;
                    }
                    expect(res.body.actuators[0].id).to.be.equal(3286);
                    expect(res.body.actuators.length).to.be.equal(1);
                    done();
                });
        });
    });

    describe('#Change an alias', function () {
        it('should change the alias of a sensor', function (done) {
            api
                .put('http://localhost:3221/devices/sensors/123/alias')
                .send({alias: 'nieuw'})
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    expect(JSON.parse(res.text).success).to.be.equal("Success, alias for 123 was successfully updated.");
                    done();
                });
        });

        it('should change the alias of a actuator', function (done) {
            api
                .put('http://localhost:3221/devices/actuators/3286/alias')
                .send({alias: 'nieuw'})
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    console.log(res);
                    expect(JSON.parse(res.text).success).to.be.equal("Success, alias for 3286 was successfully updated.");
                    done();
                });
        });
    });

    describe('#Change an clientIntervalTimer', function () {
        it('should change the timer of a sensor', function (done) {
            api
                .put('http://localhost:3221/devices/sensors/123/interval')
                .send({interval: 18})
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    expect(JSON.parse(res.text).success).to.be.equal("Success, interval for 123 was successfully updated.");
                    done();
                });
        });
    });

    after(function (done) {
        done();
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