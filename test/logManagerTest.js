var expect              = require('chai').expect;
var api                 = require('superagent');
var Sensor              = require('../models/sensor');
var Actuator            = require('../models/actuator');
var logger              = require('../modules/logManager');
var eventLog            = require('../models/eventLog');
var dataLog             = require('../models/dataLog');

describe('Logging', function() {
    before(function(done) {
        eventLog.delete();
        dataLog.delete();
        done();
    });

    describe('#Log an event to the database', function() {
        it('should log new data.', function(done) {
            logger.logEvent({id:1000015, model:{name:'temperatuur'}, config:{alias:"woonkamer temp"}}, 'sensor', 'automatic', 'reageert niet meer', 4, function(err,res) {
                if(err) { throw err; }
                done();
            });
        });
    });

    describe('#Log data to the database', function() {
        it('should log new data.', function(done) {
            logger.logData({id:1000015, model:{name:'temperatuur'}, config:{alias:"woonkamer temp"}}, 4, function(err,res) {
                if(err) { throw err; }
                done();
            });
        });
    });

    describe('#Log more data to the database', function() {
        it('should log more new data.', function(done) {
            logger.logData({id:1000015, model:{name:'temperatuur'}, config:{alias:"woonkamer temp"}}, 6, function(err,res) {
                if(err) { throw err; }
                done();
            });
        });
    });

    describe('#Get all sensor event logs', function() {
        it('should get all sensor event logs', function (done) {
            logger.getEvents(1000015, function(err,res) {
                if(err) throw err;
                done();
            });
        });
    });

    describe('#Get all event logs', function() {
        it('should get all event logs', function (done) {
            logger.getAllEvents(4, function(err,res) {
                if(err) throw err;
                expect(res).to.have.length.above(1);
                done();
            });
        });
    });

    describe('#Get no event logs', function() {
        it('shouldt get a event log because there is none with severity 2 or lower', function (done) {
            logger.getAllEvents(2, function(err,res) {
                if(err) throw err;
                expect(res).to.be.empty;
                done();
            });
        });
    });


    describe('#Get data for a specific device', function() {
        it('should get data logs', function (done) {
            logger.getData(1000015, function(err,res) {
                if(err) throw err;
                done();
            });
        });
    });

    describe('#Get 1 most recent data log for a specific device', function() {
        it('should the most recent data log', function (done) {
            logger.getStatus(1000015, function(err,res) {
                if(err) throw err;
                done();
            });
        });
    });

    after(function(done){
        eventLog.delete();
        dataLog.delete();
        done();
    });
});