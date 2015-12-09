"use strict";

var Scenario = require('../models/scenario');

function create(name, description, cb) {
    var scenario = new Scenario({name: name, description: description});
    Scenario.save(scenario).then(function(res) {
        cb(null, res);
    }).error(function(err){
        cb({error: "Cannot save scenario.", message: err});
    });
}

function get(id, cb) {
    Scenario.get(id).then(function(res) {
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

function updateById(id, scenario, cb) {
    Scenario.get(id).then(function(old) {
        old.merge(scenario);
        old.save().then(function (res) {
            cb(null, res);
        }).error(function (err) {
            cb({error: "Cannot update scenario.", message: err});
        });
    }).error(function (err) {
        cb({error: "Cannot update scenario.", message: err});
    });
}

function update(scenario, cb) {
    scenario.save().then(function(res) {
        cb(null, res);
    }).error(function(err) {
        cb({error: "Cannot update scenario.", message: err});
    });
}

module.exports = {
    new: create,
    get: get,
    getAll: getAll,
    update: update,
    updateById: updateById
};
