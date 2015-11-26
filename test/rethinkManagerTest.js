var expect = require('chai').expect,
    Sensor = require('../models/sensor'),
    Actuator = require('../models/actuator'),
    rethinkManager = require('../modules/rethinkManager');

describe('Sensor', function () {
    var id = 321123;

    after(function(done) {
        // get the sensor
        Sensor.get(id).then(function(sensor) {

            // delete the sensor
            sensor.delete().then(function() {
                done();
            });
        }).error();
    });

    after(function(done) {
        // get the sensor
        Sensor.get(id+1).then(function(sensor) {

            // delete the sensor
            sensor.delete().then(function() {
                done();
            });
        }).error();
    });


    it('Shouldn\'t save the sensor', function(done) {
        var sensor = {
            id: id,
            model: {
                name: 'philips temp',
                sokVersion: 0.11,
                description: 'Temperatuur op 0.1c nauwkeuring',
                commands: {}
            },
            config: {
                ip: '192.168.0.201',
                alias: 'Temperatuur woonkamer',
                clientRequestInterval: 3000
            }
        }
        rethinkManager.saveDevice(sensor, 'sensor' ,function(err, res){
            if(err) {
                done();
            } else {
                done('was succesful');
            }
        });
    });

    it('Shouldn\'t get the sensor', function(done) {
        rethinkManager.getDevice(id, 'sensor', function(err, res){
            if(err) {
                done();
            } else {
                done('was succesful');
            }
        });
    });

    it('Should save the sensor', function(done) {
        var sensor = {
            id: id,
            model: {
                name: 'philips temp',
                    sokVersion: 0.11,
                    description: 'Temperatuur op 0.1c nauwkeuring',
                    commands: {
                    status: {
                        name : 'status',
                            parameters: {},
                            requestInterval: 5000,
                            httpMethod: 'GET',
                            returns: {
                            Celsius: 'Number',
                                Fahrenheit: 'Number',
                                Kelvin: 'Number'
                        },
                        description: 'Retrieves status of philips hue lamp'
                    }
                }
            },
            config: {
                ip: '192.168.0.201',
                alias: 'Temperatuur woonkamer',
                clientRequestInterval: 3000
            }
        }
        rethinkManager.saveDevice(sensor, 'sensor' ,function(err, res){
            if(err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Should save another sensor', function(done) {
        var sensor = {
            id: id+1,
            model: {
                name: 'philips temp',
                sokVersion: 0.11,
                description: 'Temperatuur op 0.1c nauwkeuring',
                commands: {
                    status: {
                        name : 'status',
                        parameters: {},
                        requestInterval: 5000,
                        httpMethod: 'GET',
                        returns: {
                            Celsius: 'Number',
                            Fahrenheit: 'Number',
                            Kelvin: 'Number'
                        },
                        description: 'Retrieves status of philips hue lamp'
                    }
                }
            },
            config: {
                ip: '192.168.0.203',
                alias: 'Temperatuur woonkamer',
                clientRequestInterval: 3000
            }
        }

        rethinkManager.saveDevice(sensor, 'sensor' ,function(err, res){
            if(err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Should get at least 2 sensors', function(done){
        rethinkManager.getAllDevices('sensor', function(err, res){
            if(err) {
                done(err);
            } else {
                expect(res.length).to.be.above(1);
                done();
            }
        })
    });

    it('Should get the sensor', function(done) {
        rethinkManager.getDevice(id, 'sensor' ,function(err, res){
            if(err) {
                done(err);
            } else {
                expect(res).to.be.an('object');
                done();
            }
        });
    });

    it('Should update the alias', function(done) {
        rethinkManager.updateAlias(id, 'sensor' , 'Temperatuur woonkamer', function(err, res){
            if(err) {
                done(err);
            } else {
                expect(res).to.be.an('object');
                expect(res.config.alias).to.equal('Temperatuur woonkamer');
                done();
            }
        });
    });

    it('Should update the requestInterval', function(done) {
        rethinkManager.updateClientRequestInterval(id, 2000, function(err, res){
            if(err) {
                done(err);
            } else {
                expect(res).to.be.an('object');
                expect(res.config.clientRequestInterval).to.equal(2000);
                done();
            }
        });
    });

    it('Should set the active status to false', function(done) {
        rethinkManager.updateActive(id, 'sensor', false, function(err, res){
            if(err) {
                done(err);
            } else {
                expect(res).to.be.an('object');
                expect(res.config.active).to.equal(false);
                done();
            }
        });
    });


    it('Should set the active status to true', function(done) {
        rethinkManager.updateActive(id, 'sensor', true, function(err, res){
            if(err) {
                done(err);
            } else {
                expect(res).to.be.an('object');
                expect(res.config.active).to.equal(true);
                done();
            }
        });
    });
});

describe('Actuator', function () {
    var id = 123321;

    after(function(done) {
        // get the actuator
        Actuator.get(id).then(function(actuator) {

            // delete the actuator
            actuator.delete().then(function() {
                done();
            });
            // something went wrong
        }).error(function(){
            done();
        });
    });

    after(function(done) {
        // get the actuator + 1
        Actuator.get(id+1).then(function(actuator) {

            // delete the sensor
            actuator.delete().then(function() {
                done();
            });
            // something went wrong
        }).error(function(){
            done();
        });
    });

    it('Shouldn\'t save the actuator', function(done) {
        var actuator = {
            id: id,
            model: {
                name: 'Philips hue',
                type: 'actuator',
                sokVersion: 0.12,
                description: 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.',
                commands: {
                    off: {
                        name: 'off',
                        parameters: {},
                        requestInterval: 5000,
                        httpMethod: 'POST',
                        returns: 'Boolean',
                        description: 'Philips hue will be turned off'
                    },
                    status: {
                        name: 'status',
                        parameters: {},
                        requestInterval: 5000,
                        httpMethod: 'GET',
                        returns: {
                            Celsius: 'Number',
                            Fahrenheit: 'Number',
                            Kelvin: 'Number'
                        },
                        description: 'Retrieves status of philips hue lamp'
                    },
                    changeColor: {
                        name: 'changeColor',
                        parameters: {
                            color: {
                                name: 'color',
                                required: true,
                                accepts: {
                                    type: 'hex',
                                    limit: [
                                        {
                                            type: 'hex',
                                            min: '0x000000',
                                            max: '0xffffff'
                                        }
                                    ],
                                    list: ['R', 'G', 'B'] //Predefined parameter values
                                },
                            }
                        },
                        requestInterval: 5000,
                        httpMethod: 'POST',
                        returns: 'Boolean',
                        description: 'Changes the color of the philips hue lamp'
                    }
                }
            },
            config: {
                ip: '192.168.0.202',
                alias: 'Lamp woonkamer',
            }
        }
        rethinkManager.saveDevice(actuator, 'actuator' ,function(err, res){
            if(err) {
                done();
            } else {
                done('was succesful');
            }
        });
    });

    it('Shouldn\'t get the actuator', function(done) {
        rethinkManager.getDevice(id, 'actuator' ,function(err, res){
            if(err) {
                done();
            } else {
                done('was succesful');
            }
        });
    });

    it('Should save the actuator', function(done) {
        var actuator = {
            id: id,
            model: {
                ip: '192.168.0.201',
                name: 'Philips hue',
                type: 'actuator',
                sokVersion: 0.12,
                description: 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.',
                commands: {
                    on: {
                        name: 'on',
                        parameters: {},
                        requestInterval: 5000,
                        httpMethod: 'POST',
                        returns: 'Boolean',
                        description: 'Philips hue will be turned on'
                    },
                    off: {
                        name: 'off',
                        parameters: {},
                        requestInterval: 5000,
                        httpMethod: 'POST',
                        returns: 'Boolean',
                        description: 'Philips hue will be turned off'
                    },
                    status: {
                        name: 'status',
                        parameters: {},
                        requestInterval: 5000,
                        httpMethod: 'GET',
                        returns: {
                            Celsius: 'Number',
                            Fahrenheit: 'Number',
                            Kelvin: 'Number'
                        },
                        description: 'Retrieves status of philips hue lamp'
                    },
                    changeColor: {
                        name: 'changeColor',
                        parameters: {
                            color: {
                                name: 'color',
                                required: true,
                                accepts: {
                                    type: 'hex',
                                    limit: [
                                        {
                                            type: 'hex',
                                            min: '0x000000',
                                            max: '0xffffff'
                                        }
                                    ],
                                    list: ['R', 'G', 'B'] //Predefined parameter values
                                },
                            }
                        },
                        requestInterval: 5000,
                        httpMethod: 'POST',
                        returns: 'Boolean',
                        description: 'Changes the color of the philips hue lamp'
                    }
                }
            },
            config: {
                ip: '192.168.0.202',
                alias: 'Lamp woonkamer',
            }
        }

        rethinkManager.saveDevice(actuator,'Actuator', function(err, res){
            if(err) {
                done(err);
            } else {
                done();
            }
        });
    });
    it('Should save another actuator', function(done) {
        var actuator = {
            id: id+1,
            model: {
                ip: '192.168.0.201',
                name: 'Philips hue',
                type: 'actuator',
                sokVersion: 0.12,
                description: 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.',
                commands: {
                    on: {
                        name: 'on',
                        parameters: {},
                        requestInterval: 5000,
                        httpMethod: 'POST',
                        returns: 'Boolean',
                        description: 'Philips hue will be turned on'
                    },
                    off: {
                        name: 'off',
                        parameters: {},
                        requestInterval: 5000,
                        httpMethod: 'POST',
                        returns: 'Boolean',
                        description: 'Philips hue will be turned off'
                    },
                    status: {
                        name: 'status',
                        parameters: {},
                        requestInterval: 5000,
                        httpMethod: 'GET',
                        returns: {
                            Celsius: 'Number',
                            Fahrenheit: 'Number',
                            Kelvin: 'Number'
                        },
                        description: 'Retrieves status of philips hue lamp'
                    },
                    changeColor: {
                        name: 'changeColor',
                        parameters: {
                            color: {
                                name: 'color',
                                required: true,
                                accepts: {
                                    type: 'hex',
                                    limit: [
                                        {
                                            type: 'hex',
                                            min: '0x000000',
                                            max: '0xffffff'
                                        }
                                    ],
                                    list: ['R', 'G', 'B'] //Predefined parameter values
                                },
                            }
                        },
                        requestInterval: 5000,
                        httpMethod: 'POST',
                        returns: 'Boolean',
                        description: 'Changes the color of the philips hue lamp'
                    }
                }
            },
            config: {
                ip: '192.168.0.202',
                alias: 'Lamp woonkamer',
            }
        }

        rethinkManager.saveDevice(actuator,'Actuator', function(err, res){
            if(err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Should get a actuator', function(done) {
        rethinkManager.getDevice(id, 'actuator' ,function(err, res){
            if(err) {
                done(err);
            } else {
                expect(res).to.be.an('object');
                done();
            }
        });
    });

    it('Should get at least 2 actuators', function(done){
        rethinkManager.getAllDevices('actuator', function(err, res){
            if(err) {
                done(err);
            } else {
                expect(res.length).to.be.above(1);
                done();
            }
        })
    });

    it('Should set the active status to false', function(done) {
        rethinkManager.updateActive(id, 'actuator', false, function(err, res){
            if(err) {
                done(err);
            } else {
                expect(res).to.be.an('object');
                expect(res.config.active).to.equal(false);
                done();
            }
        });
    });
});