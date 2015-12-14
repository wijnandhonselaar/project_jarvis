"use strict";

var Settings = require('../models/settings');
var thinky = require('thinky')();
var Errors = thinky.Errors;


function initSettings(cb) {
    var settings = new Settings({
        id: 1
    });
    Settings.save(settings).then(function(res) {
        cb();
    }).error(function(err){
        cb(err);
    });
}

function getLogLevel(cb) {
    Settings.get(1).run().then(function(res) {
        cb(null, res.logLevel);
    }).catch(Errors.DocumentNotFound, function(err) {
        initSettings(function(err){
           if(err) throw err;

            getLogLevel(cb);
        });
    }).error(function(error) {
        cb(error);
    });
}

function setLogLevel(level, cb) {
    if(level === undefined) {
        cb({error: "loglevel is undefined"});
    } else {
        level = parseInt(level);
        if(level > 0 && level < 6) {
            Settings.get(1).run().then(function (res) {
                res.merge({logLevel: level}).save().then(function (result) {
                    cb(null, result);
                });
            }).catch(Errors.DocumentNotFound, function (err) {
                initSettings(function (err) {
                    if (err) throw err;

                    getLogLevel(cb);
                });
            }).error(function (error) {
                cb(error);
            });
        } else {
            cb({error: "loglevel is invalid."});
        }
    }
}

module.exports = {
    getLogLevel: getLogLevel,
    setLogLevel: setLogLevel
};