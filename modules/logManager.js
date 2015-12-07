"use strict";

var eventLog = require('../models/eventLog');
var dataLog = require('../models/dataLog');
/**
 * log event data
 * @param device
 * @param type
 * @param category
 * @param message
 * @param severity
 * @param cb
 */
function logEvent(device, type, category, message, severity, cb) {
    var log = new eventLog({
        device: {
            id: device.id,
            name: device.model.name,
            alias: device.config.alias
        },
        type: type,
        category: category,
        message: message,
        severity: severity
    });
    eventLog.save(log).then(function(res) {
        cb(null, res);
    }).error(function(err){
        console.log(err);
        cb({error: "Not found.", message: err});
    });
}

/**
 * log sensor data
 * @param device
 * @param value
 */
function logData(device, value, cb) {
    var log = new dataLog({
        device: {
            id: device.id,
            name: device.model.name,
            alias: device.config.alias
        },
        value: value
    });
    dataLog.save(log).then(function(res) {
        cb(null, res);
    }).error(function(err){
        cb({error: "Not found.", message: err});
    });
}
/**
 * get events for 1 device
 * @param deviceid
 * @param cb
 */
function getEvents(deviceid, cb) {
    eventLog.filter({device: {id:deviceid}}).then(function(res) {
        cb(null, res);
    }).error(function(err) {
        cb({error: "Not found.", message: err});
    });
}

/**
 * get all events for all devices
 * @param severity (optional)
 * @param cb
 */
function getAllEvents(severity, cb) {
    if(severity > 0 || severity < 6) {
        severity = severity;
    } else {
        severity = 5; // TODO default severity
    }

    eventLog.filter(r.row('severity').lt(severity)).run(function(res) {
        cb(null, res);
    }).error(function(err) {
        cb({error: "Not found.", message: err});
    });
}

/**
 * get a list of data for 1 sensor
 * @param deviceid
 * @param cb
 */
function getData(deviceid, cb) {
    dataLog.filter({device: {id:deviceid}}).then(function(res) {
        cb(null, res);
    }).error(function(err) {
        cb({error: "Not found.", message: err});
    });
}

/**
 * get the latest data log for 1 sensor.
 * @param deviceid
 * @param cb
 */
function getStatus(deviceid, cb) {
    dataLog.filter({device: {id:deviceid}}).orderBy('timestamp').limit(0).run(function(res) {
        cb(null, res);
    }).error(function(err) {
        cb({error: "Not found.", message: err});
    });
}

module.exports = {
    logEvent: logEvent,
    logData: logData,
    getEvents: getEvents,
    getAllEvents: getAllEvents,
    getData: getData,
    getStatus: getStatus
}
