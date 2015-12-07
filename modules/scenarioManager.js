"use strict";

var Scenario = require('../models/scenario');

function create(scenario) {
    Scenario.save(scenario).then(function(res) {
        cb(null, res);
    }).error(function(err){
        cb({error: "Cannot save scenario.", message: err});
    });
}

function get(id, cb) {
    Scenario.filter({id: id}).then(function(res) {
        cb(null, res);
    }).error(function(err) {
        cb({error: "Not found.", message: err});
    });
}

function getAll(cb) {
    Scenario.run().then(function(res) {
       cb(null, res);
    }).error(function(err) {
        cb({error: "Not found.", message: err});
    });
}

function update(scenario, cb) {
    Scenario.save(scenario).then(function(res) {
        cb(null, res);
    }).error(function(err) {
       cb({error: "Cannot update scenario.", message: err});
    });
}

module.exports = {
    new: create,
    get: get,
    getAll: getAll,
    update: update
};
