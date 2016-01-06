/*jslint node: true */
"use strict";

var io = null;
var eventLog = require('../models/eventLog');
var dataLog = require('../models/dataLog');
var scenarioLog = require('../models/scenarioLog');
var settings = require('../modules/settingManager');
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

        if (typeof cb === "function") {
            cb(null, res);
        }
    }).error(function(err){
        if (typeof cb === "function") {
            cb(err);
        }
        console.error(err);
        logEvent(device, type, category, err, 2);
    });
}

/**
 * log sensor data
 * @param device
 * @param cb
 */

function logData(device, cb) {
    console.log(device.model);
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
 * log scenario event
 * @param scenario
 * @param cb
 */
function logScenario(scenario, cb) {
    var message = '';
    if(scenario.status) {
        message = 'Scenario: ' + scenario.name + ' is ingeschakeld.';
    } else {
        message = 'Scenario: ' + scenario.name + ' is uitgeschakeld.';
    }
    var log = new scenarioLog({
        name: scenario.name,
        status: scenario.status,
        severity: severity.notice,
        message: message,
        timestamp: Math.round((new Date()).getTime() / 1000)
    });
    scenarioLog.save(log).then(function (res) {
        io.emit('logAdded', log);
        if(typeof cb === "function") {
            cb(null, res);
        }
    }).error(function(err) {
        console.error(err);
        if(typeof cb === "function") {
            cb(err);
        }
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
 * @param offset skip results
 * @param limit limit the number of results
 * @param cb
 */

function getAllEvents(offset, limit, cb) {
    settings.getLogLevel(function(err, res){
        if(isNaN(offset)){
            offset = 0;
        }

        if(isNaN(limit)) {
            limit = 50;
        } else if(limit === 0) {
            limit = 50;
        }

        eventLog.filter(function (log) {
            return log("severity").lt(res + 1);
        }).orderBy((r.desc('timestamp'))).skip(offset).limit(limit).then(function(res) {
            cb(null, res);
        }).error(function(err) {
            cb({error: "Not found.", message: err});
        });
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
    logScenario: logScenario,
    getEvents: getEvents,
    getAllEvents: getAllEvents,
    getData: getData,
    getStatus: getStatus
};
