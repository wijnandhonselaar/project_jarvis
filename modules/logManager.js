"use strict";

var io = null;
var eventLog = require('../models/eventLog');
var dataLog = require('../models/dataLog');
var thinky = require('../models/thinky.js');
var r = thinky.r;
var automatic = "Automatisch";
var manual = "Handmatig";
var severity = {
           alert : 1,
           error : 2,
           warning : 3,
           notice : 4,
           all : 5
    };

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
        severity: severity,
        timestamp: Math.round((new Date()).getTime() / 1000)
    });

    eventLog.save(log).then(function(res) {
        io.emit('logAdded', log);
        console.log("hier");
        if (typeof cb === "function") {
            cb(null, res);
        }
    }).error(function(err){
        if (typeof cb === "function") {
            cb(err);
        }
        console.log(err);
        logEvent(device, type, category, err, 2);
    });
}

/**
 * log sensor data
 * @param device
 * @param value
 */

function logData(device, cb) {
    var log = new dataLog({
        device: {
            id: device.id,
            name: device.model.name,
            alias: device.config.alias
        },
        status: device.status,
        timestamp: Math.round((new Date()).getTime() / 1000)
    });
    dataLog.save(log).then(function(res) {
        io.emit('dataLogAdded', log);
        if (typeof cb === "function") {
            cb(null, res);
        }
    }).error(function(err){
        if (typeof cb === "function") {
            cb(err);
        }
        logEvent(device, device.model.type, "Automatisch", err, 2);
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
 * @param offset skip results
 * @param limit limit the number of results
 * @param cb
 */

function getAllEvents(severity, offset, limit, cb) {
    if((severity > 0 || severity < 6) && severity !== null) {

    } else {
        severity = 5;
    }

    if(isNaN(offset)){
        offset = 0;
    }

    if(isNaN(limit)) {
        limit = 50;
    } else if(limit === 0) {
        limit = 50;
    }

    eventLog.filter(function (log) {
        return log("severity").lt(severity + 1);
    }).orderBy((r.desc('timestamp'))).skip(offset).limit(limit).then(function(res) {
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
    dataLog.filter({device: {id:deviceid}}).orderBy((r.desc('timestamp'))).then(function(res) {
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
    dataLog.filter({device: {id:deviceid}}).orderBy((r.desc('timestamp'))).limit(1).then(function(res) {
        cb(null, res);
    }).error(function(err) {
        cb({error: "Not found.", message: err});
    });
}

module.exports = {
    init: function (socket) {
        io = socket;
     },
    severity : severity,
    manual: manual,
    automatic: automatic,
    logEvent: logEvent,
    logData: logData,
    getEvents: getEvents,
    getAllEvents: getAllEvents,
    getData: getData,
    getStatus: getStatus
};
