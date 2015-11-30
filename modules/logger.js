"use strict";

var Log = require('../models/log');

function log(device, type, message, severity, cb) {
    var log = new Log({
        device: device,
        type: type,
        message: message,
        severity: severity,
        timestamp: JSON.stringify(Date.now())
    });
    Log.save(log).then(function(res) {
        cb(null, res);
    }).error(function(err){
        cb({error: "Not found.", message: err});
    });
}

function get(deviceid, cb) {
    Log.filter({device: deviceid}).then(function(res) {
        cb(null, res);
    }).error(function(err) {
        cb({error: "Not found.", message: err});
    });
}

function getAll(cb) {
    Log.run().then(function(res) {
        cb(null, res);
    }).error(function(err) {
        cb({error: "Not found.", message: err});
    });
}

function getSensors(cb) {
    Log.run().then(function(res) {
        cb(null, res);
    }).error(function(err) {
        cb({error: "Not found.", message: err});
    });
}

function getActuators(cb) {
    Log.run().then(function(res) {
        cb(null, res);
    }).error(function(err) {
        cb({error: "Not found.", message: err});
    });
}

module.exports = {
    log: log,
    get: get,
    getAll: getAll,
    getSensors: getSensors,
    getActuators: getActuators
};
