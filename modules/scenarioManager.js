"use strict";

var Scenario = require('../models/scenario');
var ruleEngine = require('./ruleEngine');
var deviceManager = require('./deviceManager');
var comm = require('./interperter/comm');
var io = null;
var scenarios = [];
//scenario: {},
//status: false
//priority: 100
//rules: {}


function create(name, description, actuators, cb) {
    var scenario = new Scenario({name: name, description: description, actuators: actuators});
    Scenario.save(scenario).then(function (res) {
        scenarios.push({
            scenario: scenario,
            status: false
        });
        cb(null, res);
    }).error(function (err) {
        cb({error: "Cannot save scenario.", message: err});
    });
}

function get(id, cb) {
    Scenario.get(id).then(function (res) {
        cb(null, res);
    }).error(function (err) {
        cb({error: "Not found.", message: err});
    });
}

function getAll(cb) {
    var count;
    Scenario.run().then(function (res) {
            for (var i = 0; i < res.length; i++) {
                count = 0;
                for (var j = 0; j < scenarios.length; j++) {
                    if (scenarios[j].scenario.id === res[i]) {

                    }
                    else {
                        count++;
                    }
                    if (count === scenarios.length - 1) {
                        scenarios.push({scenario: res[i], status: false})
                    }
                }
            }

        cb(null, scenarios);
    }).error(function (err) {
        cb({error: "Not found.", message: err});
    });
}

function updateById(id, scenario, cb) {
    Scenario.get(id).then(function (old) {
        old.merge(scenario);
        old.save().then(function (res) {
            cb(null, res);
        }).catch(function (err) {
            console.error(err);
            cb({error: "Cannot update scenario.", message: err});
        });
    }).catch(function (err) {
        console.error(err);
        cb({error: "Cannot update scenario.", message: err});
    });
}

//TODO error tijdens uitvoeren, crasht niet maar werkt wel, geen idee, promise error.
function deleteById(id, cb) {
    Scenario.get(id).delete().run(function (res) {
        cb(null, res);
    }).error(function (err) {
        cb({error: "cannot delete scenario.", message: err});
    });
}

function deleteFromScenarios(id, cb) {
    Scenario.get(id).then(function (res) {
        for (var i = 0; i < scenarios.length; i++) {
            if (res.id === scenarios[i].scenario.id) {
                scenarios.splice(i, 1);
                cb(null, res);
            }
        }
    });
}

function update(scenario, cb) {
    scenario.save().then(function (res) {
        cb(null, res);
    }).error(function (err) {
        cb({error: "Cannot update scenario.", message: err});
    });
}

function toggleState(scenarioString, cb) {
    var scenario = JSON.parse(scenarioString);
    for (var i = 0; i < scenarios.length; i++) {
        if (scenario.id == scenarios[i].scenario.id) {
            if (scenarios[i].status === false) {
                scenarios[i].status = true;
                triggerOnCommands(scenarios[i]);
                cb(null, scenarios[i]);
            }
            else {
                scenarios[i].status = false;
                triggerOffCommands(scenarios[i]);
                cb(null, scenarios[i]);
            }

        }
    }
}

function validateRules(event) {
    for (var i = 0; i < scenarios.length; i++) {
        ruleEngine.apply(scenarios[i], event);
    }
}

function triggerOnCommands(scenario) {
    var currentDevice;
    for (var i = 0; i < scenario.scenario.actuators.length; i++) {
        currentDevice = deviceManager.getActuator(scenario.scenario.actuators[i].deviceid);
        comm.post(scenario.scenario.actuators[i].action.command, currentDevice, [], function (data) {
            currentDevice.status = data;
            io.emit("deviceUpdated", currentDevice);
        });
    }
}

function triggerOffCommands(scenario) {
    var currentDevice;
    var command;
    console.log(scenario);
    for (var i = 0; i < scenario.scenario.actuators.length; i++) {
        currentDevice = deviceManager.getActuator(scenario.scenario.actuators[i].deviceid);
        if (scenario.scenario.actuators[i].action.command === 'on') {
            console.log(scenario.scenario.actuators[i].action.command);
            command = 'off';
        }
        else {
            command = 'on';
        }
        comm.post(command, currentDevice, [], function (data) {
            currentDevice.status = data;
            io.emit("deviceUpdated", currentDevice);
        });
    }
}

function getByName(name) {
    Scenario.filter({name: name}).run().then(function (res) {
            return res[0];
        }).
        catch(function (err) {
            throw err;
        });
}

module.exports = {
    init: function (socketio) {
        if (socketio) io = socketio;
    },
    deleteFromScenarios: deleteFromScenarios,
    validate: validateRules,
    toggleState: toggleState,
    deleteById: deleteById,
    new: create,
    get: get,
    getAll: getAll,
    update: update,
    updateById: updateById,
    getByName: getByName
};
