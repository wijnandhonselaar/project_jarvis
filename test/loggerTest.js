var expect              = require('chai').expect;
var api                 = require('superagent');
var Sensor              = require('../models/sensor');
var Actuator            = require('../models/actuator');
var logger              = require('../modules/logger');
var Log                 = require('../models/log');

describe('Logging', function() {
    describe('#Log to database', function() {
        it('should log new data.', function(done) {
            logger.log(1000015, 'sensor', 'category', {message: 'message'}, 1, function(err,res) {
                if(err) { throw err; }
                done();
            });
        });
    });

    describe('#Get all sensor logs', function() {
        it('should get all sensor logs', function (done) {
            logger.getSensors(function(err,res) {
                if(err) throw err;
                done();
            });
        });
    });

    describe('#Get all actuator logs', function() {
        it('should get all actuator logs', function (done) {
            logger.getActuators(function(err,res) {
                if(err) throw err;
                done();
            });
        });
    });

    describe('#Get all logs for a specific device', function() {
        it('should get all actuator logs', function (done) {
            logger.get(1000015, function(err,res) {
                if(err) throw err;
                expect(res[0].type).to.equal('sensor');
                done();
            });
        });
    });

    after(function(done){
        Log.delete();
        done();
    });
});