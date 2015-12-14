"use strict";

var Scenario = require('../models/scenario');
var ruleEngine = require('./ruleEngine');
var deviceManager = require('./deviceManager');
var scenarios = [];
//scenario: {},
//status: false


function create(name, description, actuators, cb) {
    var scenario = new Scenario({name: name, description: description, actuators: actuators});
    Scenario.save(scenario).then(function (res) {
        scenarios.push(                    {
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
    Scenario.run().then(function (res) {
        scenarios = [];
        if (scenarios.length === 0) {
            for (var i = 0; i < res.length; i++) {
                scenarios.push(
                    {
                        scenario: res[i],
                        status: false
                    }
                );
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
    get(id, function (err, result) {
        for (var i = 0; i < scenarios.length; i++) {
            if (scenarios[i].scenario.id === result.id) {
                scenarios.splice(i, 1);
                Scenario.get(id).delete().run(function (res) {
                    cb(null, res);
                }).error(function (err) {
                    cb({error: "cannot delete scenario.", message: err});
                })
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
                triggerCommands(scenarios[i]);
                cb(null, scenarios[i]);
            }
            else {
                scenarios[i].status = false;
                cb(null, scenarios[i]);
            }

        }
    }
}

function validateRules(event){
    for(var i = 0; i<scenarios.length; i++){
        ruleEngine.apply(scenarios[i],event);
    }
}

function triggerCommands(scenario){
    var currentDevice;
    console.log(scenario);
    for(var i = 0; i<scenario.scenario.actuators.length; i++){
        currentDevice = deviceManager.getActuator(scenario.scenario.actuators[i].deviceid);
            console.log(i + " is uitgevoerd");
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
