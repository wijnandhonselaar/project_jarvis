/*jslint node: true */
"use strict";

var Scenario = require('../models/scenario');
var ruleEngine = require('./ruleEngine');
var comm = require('./interperter/comm');
var io = null;
var deviceManager = null;
var conflictManager = null;
var scenarios = [];


/**
 * Create new scenario
 * @param name
 * @param description
 * @param actuators
 * @param cb
 */
function create(name, description, actuators, cb) {
    var scenario = new Scenario(
        {
        name: name,
        description: description,
        actuators: actuators,
        status: false
    });
    Scenario.save(scenario).then(function (res) {
        conflictManager.preEmptiveDetect(scenario);
        cb(null, res);
    }).error(function (err) {
        console.log(err);
        cb({error: "Cannot save scenario.", message: err});
    });
}

/**
 * Get scenario by id
 * @param id
 * @param cb
 */
function get(id, cb) {
    Scenario.get(id).then(function (res) {
        cb(null, res);
    }).error(function (err) {
        cb({error: "Not found.", message: err});
    });
}

/**
 * Get all scenarios
 * @param cb
 */
function getAll(cb) {
    scenarios = [];
    Scenario.run().then(function (res) {
          scenarios = res;
        cb(null, scenarios);
    }).error(function (err) {
        cb({error: "Not found.", message: err});
    });
}

/**
 * Update scenario by ID
 * @param id
 * @param scenario
 * @param cb
 */
function updateById(id, scenario, cb) {
    Scenario.get(id).then(function (old) {
        old.merge(scenario);
        old.save().then(function (res) {
            conflictManager.preEmptiveDetect(scenario);
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

/**
 * Delete scenario by id
 * @param id
 * @param cb
 */
function deleteById(id, cb) {
    Scenario.get(id).delete().run(function (res) {
        cb(null, res);
    }).error(function (err) {
        cb({error: "cannot delete scenario.", message: err});
    });
}


/**
 * Update scenario by reference
 * @param scenario
 * @param cb
 */
function update(scenario, cb) {
    scenario.save().then(function (res) {
        cb(null, res);
    }).error(function (err) {
        cb({error: "Cannot update scenario.", message: err});
    });
}

/**
 * Temp functie voor het finish command, mooiste zou zijn als hiervoor een apart tabje in de front-end gemaakt zou worden waar gebruikers kunnen
 * aangeven wat er gebeurt op het moment dat het scenario eindigt
 */
function invert(scenario){
    var scenarioCopy = JSON.parse(JSON.stringify(scenario));
    for(var i = 0; i<scenarioCopy.actuators.length; i++){
        var ac = scenarioCopy.actuators[i];
        if(ac.action.command == 'on'){
            ac.action.command = 'off';
        } else {
            ac.action.command = 'on';
        }
        //console.log( scenarioCopy.actuators[i]);
    }
    return scenarioCopy;
}

/**
 * Toggle scenario state (active/disabled)
 * @param scenario
 * @param cb
 */
function toggleState(scenario, cb) {
    if(typeof scenario === 'string') scenario = JSON.parse(scenario);
    for (var i = 0; i < scenarios.length; i++) {
        if (scenario.id == scenarios[i].id) {
            if (scenarios[i].status === false) {
                execute(scenario, 'start', function(err, data){
                    cb(err, data)
                });
            }
            else {
                execute(scenario, 'finish', function(err, data){
                    cb(err, data);
                });
            }
        }
    }
}

/**
 * Execute scenario
 * @param scenario
 * @param scenarioState
 * @param cb
 */
function execute(scenario, scenarioState, cb){
    if(scenarioState == 'start') {
        start(scenario , cb);
    } else {
        stop(scenario, cb);
        scenario = invert(scenario);
    }
    for (var deviceLoop = 0; deviceLoop < scenario.actuators.length; deviceLoop++) {
        var command = scenario.actuators[deviceLoop].action.command;
        var device = deviceManager.getActuator(scenario.actuators[deviceLoop].deviceid);
        if (deviceManager.checkState(command, device)) {
            if (!conflictManager.detect(command, device, scenario)) {
                deviceManager.executeCommand(command, device, {});
            }
        }
    }

    function updateCB(err, data){
        if(err) {console.error(err); throw err;}
        //console.log(data);
    }
}

/**
 * Start scenario
 * @param scenario
 * @param cb
 */
function start(scenario, cb){
    for (var i = 0; i < scenarios.length; i++) {
        if (scenario.id === scenarios[i].id) {
            if (scenarios[i].status === false) {
                scenarios[i].status = true;
                if(cb) {
                    cb(null, scenarios[i]);
                }
            }
            updateById(scenarios[i].id, scenarios[i],updateCB);
        }
    }
    function updateCB(err, data){
        if(err) {console.error(err); throw err;}
        //console.log(data);
    }
}


/**
 * Stop Scenario
 * @param scenario
 * @param cb
 */
function stop(scenario, cb){
    for (var i = 0; i < scenarios.length; i++) {
        if (scenario.id === scenarios[i].id) {
            if (scenarios[i].status === true) {
                scenarios[i].status = false;
                if(cb) cb(null, scenarios[i]);
            }
            updateById(scenarios[i].id, scenarios[i], updateCB);
        }
    }
    function updateCB(err, data){
        if(err) {console.error(err); throw err;}
        //console.log(data);
    }
}

/**
 * Validate rules set on scenarios
 * @param event
 */
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


/**
 * Get scenario by name
 * @param name
 * @param cb
 */
function getByName(name, cb) {
        Scenario.filter({name: name}).run().then(function (res) {
            cb(res[0]);
        }).
        catch(function (err) {
            throw err;
        });
}

module.exports = {
    init: function (socketio, cnflictmanager, dviceManager) {
        getAll(function(){});
        if (socketio) io = socketio;
        if(cnflictmanager) conflictManager = cnflictmanager;
        if(dviceManager) deviceManager = dviceManager;
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
    stop:stop,
    execute:execute,
    scenarios:scenarios
};
