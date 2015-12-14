var expect = require('chai').expect;
var eventLog = require('../models/eventLog.js');
var dataLog = require('../models/dataLog.js');

describe('eventLog', function () {
    before(function(done) {
        eventLog.delete();
        done();
    });
    it('Shouldn\'t save a new log, no message', function (done) {
        // create the new log
        var log = new eventLog({
            device: 1
        });
        // save the new sensor
        eventLog.save(log).then(function(res) {
            //done('saved with no status object');
        }).error(function(){
            done();
        });
    });
    it('Shouldn\'t save a new log, no device', function (done) {
        // create the new loh
        var log = new eventLog({
            message: {message: 'message'}
        });
        // save the new log
        eventLog.save(log).then(function(res) {
        }).error(function(){
            done();
        });
    });
    it('Shouldn\'t save a new log, no severity', function (done) {
        // create the new log
        var log = new eventLog({
            device: 1,
            message: {message: 'message'}
        });
        // save the new log
        eventLog.save(log).then(function(res) {
        }).error(function(){
            done();
        });
    });
    it('Shouldn\'t save a new log, no type', function (done) {
        // create the new log
        var log = new eventLog({
            device: 1,
            message: {message: 'message'},
            severity: 1
        });
        // save the new log
        eventLog.save(log).then(function(res) {
        }).error(function(){
            done();
        });
    });
    it('Should save a new log', function (done) {
        // create the new log
        var log = new eventLog({
            device: {
                id: 1,
                name: "blaat",
                alias: "schaap"
            },
            type: 'sensor',
            message: 'message',
            severity: 1,
            category: 'manual',
            timestamp: 55498498
        });
        // save the new log
        eventLog.save(log).then(function(res) {
            done();
        }).error(function(err){
            console.log(err);
        });
    });
    after(function(done) {
        eventLog.delete();
        done();
    });
});


describe('dataLog', function () {
    before(function (done) {
        dataLog.delete();
        done();
    });

    it('Shouldn\'t save a new log, no value', function (done) {
        // create the new log
        var log = new dataLog({
            device: {
                id: 1,
                name: "blaat",
                alias: "schaap"
            }
        });
        // save the new sensor
        dataLog.save(log).then(function(res) {
            done('saved without value...');
        }).error(function(){
            done();
        });
    });


    it('Shouldn\'t save a new log, no device id', function (done) {
        // create the new log
        var log = new dataLog({
            device: {
                name: "blaat",
                alias: "schaap"
            }
        });
        // save the new sensor
        dataLog.save(log).then(function(res) {
            done('saved without device id...');
        }).error(function(){
            done();
        });
    });

    it('Should save a new log', function (done) {
        // create the new log
        var log = new dataLog({
            device: {
                id: 1,
                name: "blaat",
                alias: "schaap"
            },
            status: {
                celcius: 50
            },
            timestamp: 51984981
        });
        // save the new log
        dataLog.save(log).then(function(res) {
            done();
        }).error(function(err){
            done(err);
        });
    });

    after(function(done) {
        dataLog.delete();
        done();
    });
});