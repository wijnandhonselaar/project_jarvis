/*jslint node: true */
"use strict";

var Scenario = require('../models/scenario');
var ruleEngine = require('./ruleEngine');
var devicemanager = require('./deviceManager');
var comm = require('./interperter/comm');
var io = null;
var scenarios = [];

function create(name, description, actuators, cb) {
    var scenario = new Scenario(
        {
        name: name,
        description: description,
        actuators: actuators,
        status: false
    });
    Scenario.save(scenario).then(function (res) {
        cb(null, res);
    }).error(function (err) {
        console.log(err);
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
    scenarios = [];
    Scenario.run().then(function (res) {
          scenarios = res;
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

function deleteById(id, cb) {
    Scenario.get(id).delete().run(function (res) {
        cb(null, res);
    }).error(function (err) {
        cb({error: "cannot delete scenario.", message: err});
    });
}


function update(scenario, cb) {
    scenario.save().then(function (res) {
        cb(null, res);
    }).error(function (err) {
        cb({error: "Cannot update scenario.", message: err});
    });
}

function toggleState(scenario, cb) {
    if(typeof scenario === 'string') scenario = JSON.parse(scenario);
    for (var i = 0; i < scenarios.length; i++) {
        if (scenario.id === scenarios[i].id) {
            if (scenarios[i].status === false) {
                scenarios[i].status = true;
                cb(null, scenarios[i]);
            }
            else {
                scenarios[i].status = false;
                cb(null, scenarios[i]);
            }
            updateById(scenarios[i].id, scenarios[i],updateCB);
        }
    }

    function updateCB(err, data){
        if(err) {console.error(err); throw err;}
        //console.log(data);
    }
}

function start(scenario, cb){
    for (var i = 0; i < scenarios.length; i++) {
        if (scenario.id === scenarios[i].id) {
            if (scenarios[i].status === false) {
                scenarios[i].status = true;
                if(cb) cb(null, scenarios[i]);
            }
            updateById(scenarios[i].id, scenarios[i],updateCB);
        }
    }
    function updateCB(err, data){
        if(err) {console.error(err); throw err;}
        //console.log(data);
    }
}

function stop(scenario, cb){
    for (var i = 0; i < scenarios.length; i++) {
        if (scenario.id === scenarios[i].id) {
            if (scenarios[i].status === true) {
                scenarios[i].status = false;
                if(cb) cb(null, scenarios[i]);
            }
            updateById(scenarios[i].id, scenarios[i],updateCB);
        }
    }
    function updateCB(err, data){
        if(err) {console.error(err); throw err;}
        //console.log(data);
    }
}

function validateRules(event) {
    for (var i = 0; i < scenarios.length; i++) {
        ruleEngine.apply(scenarios[i], event);
    }
}
//
//function triggerOnCommands(scenario) {
//    console.log(scenario);
//    var currentDevice;
//
//    for (var i = 0; i < scenario.actuators.length; i++) {
//        currentDevice = devicemanager.getActuator(scenario.actuators[i].id);
//        comm.post(scenario.actuators[i].action.command, currentDevice, [], function (data) {
//            currentDevice.status = data;
//            io.emit("deviceUpdated", currentDevice);
//        });
//    }
//}
//
//function triggerOffCommands(scenario) {
//    var currentDevice;
//    var command;
//    for (var i = 0; i < scenario.actuators.length; i++) {
//        currentDevice = devicemanager.getActuator(scenario.actuators[i].deviceid);
//        if (scenario.actuators[i].action.command === 'on') {
//            console.log(scenario.actuators[i].action.command);
//            command = 'off';
//        }
//        else {
//            command = 'on';
//        }
//        comm.post(command, currentDevice, [], function (data) {
//            currentDevice.status = data;
//            io.emit("deviceUpdated", currentDevice);
//        });
//    }
//}

function getByName(name, cb) {
        Scenario.filter({name: name}).run().then(function (res) {
            cb(res[0]);
        }).
        catch(function (err) {
            throw err;
        });
}

module.exports = {
    init: function (socketio) {
        getAll(function(){});
        if (socketio) io = socketio;
    },
    validate: validateRules,
    toggleState: toggleState,
    deleteById: deleteById,
    new: create,
    get: get,
    getAll: getAll,
    update: update,
    updateById: updateById,
    getByName: getByName,
    start:start,
    stop:stop
};
