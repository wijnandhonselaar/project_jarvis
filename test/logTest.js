var expect = require('chai').expect;
var Log = require('../models/eventLog.js');

describe('Log', function () {
    before(function(done) {
        Log.delete();
        done();
    });
    it('Shouldn\'t save a new log, no message', function (done) {
        // create the new log
        var log = new Log({
            device: 1
        });
        // save the new sensor
        Log.save(log).then(function(res) {
            //done('saved with no status object');
        }).error(function(){
            done();
        });
    });
    it('Shouldn\'t save a new log, no device', function (done) {
        // create the new loh
        var log = new Log({
            message: {message: 'message'}
        });
        // save the new log
        Log.save(log).then(function(res) {
        }).error(function(){
            done();
        });
    });
    it('Shouldn\'t save a new log, no severity', function (done) {
        // create the new log
        var log = new Log({
            device: 1,
            message: {message: 'message'}
        });
        // save the new log
        Log.save(log).then(function(res) {
        }).error(function(){
            done();
        });
    });
    it('Shouldn\'t save a new log, no type', function (done) {
        // create the new log
        var log = new Log({
            device: 1,
            message: {message: 'message'},
            severity: 1
        });
        // save the new log
        Log.save(log).then(function(res) {
        }).error(function(){
            done();
        });
    });
    it('Should save a new log', function (done) {
        // create the new log
        var log = new Log({
            device: 1,
            type: 'sensor',
            message: {message: 'message'},
            severity: 1,
            category: 'manual',
            timestamp: JSON.stringify(Date.now())
        });
        // save the new log
        Log.save(log).then(function(res) {
            done();
        }).error(function(err){
            console.log(err);
        });
    });
    after(function(done) {
        Log.delete();
        done();
    });
});


