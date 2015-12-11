"use strict";

var Scenario = require('../models/scenario');

var scenarios = [];
//scenario: {},
//status: false


function create(name, description, actuators, cb) {
    var scenario = new Scenario({name: name, description: description, actuators: actuators});
    Scenario.save(scenario).then(function (res) {
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
function deleteById(id, cb) {
    Scenario.get(id).delete().run(function (res) {
        cb(null, res);
    }).error(function (err) {
        cb({error: "cannot delete scenario.", message: err});
    })
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
            if(scenarios[i].status === false){
                scenarios[i].status = true;
                cb(null, scenarios[i]);
            }
            else{
                scenarios[i].status = false;
                cb(null, scenarios[i]);
            }

        }
    }

}

module.exports = {
    toggleState: toggleState,
    deleteById: deleteById,
    new: create,
    get: get,
    getAll: getAll,
    update: update,
    updateById: updateById
};
