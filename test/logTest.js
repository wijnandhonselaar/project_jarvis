var expect = require('chai').expect;
var Log = require('../models/log.js');

describe('Log', function () {
    it('Shouldn\'t save a new log, no message', function (done) {
        // create the new sensor
        var log = new Log({
            device: 'device'
        });
        // save the new sensor
        Log.save(log).then(function(res) {
            //done('saved with no status object');
        }).error(function(){
            done();
        });
    });
    it('Shouldn\'t save a new log, no device', function (done) {
        // create the new sensor
        var log = new Log({
            message: 'message'
        });
        // save the new sensor
        Log.save(log).then(function(res) {
            //done('saved with no status object');
        }).error(function(){
            done();
        });
    });
    it('Shouldn\'t save a new log, no severity', function (done) {
        // create the new sensor
        var log = new Log({
            device: 'device',
            message: 'message'
        });
        // save the new sensor
        Log.save(log).then(function(res) {
            //done('saved with no status object');
        }).error(function(){
            done();
        });
    });
    it('Should save a new log', function (done) {
        // create the new sensor
        var log = new Log({
            device: 'device',
            message: 'message',
            severity: 1
        });
        // save the new sensor
        Log.save(log).then(function(res) {
            done();
        }).error(function(err){
            console.log(err);
        });
    });
});


