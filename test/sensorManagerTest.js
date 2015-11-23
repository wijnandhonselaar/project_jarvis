var expect              = require('chai').expect;
var should              = require('should');
var request             = require('supertest');
var sensorManager       = require('../classes/sensorManager');

describe('Sensor manager', function() {
    before(function (done) {
        done();
    });

    describe('#Add sensor', function () {
        it('should add a sensor to the list of sensors', function (done) {
            sensorManager.add({name: "temperature"});
            expect(sensorManager.getAll().length).to.equal(1);
            done();
        });
    });

    describe('#Get all sensors', function () {
        it('should return a list of all sensors', function (done) {
            var sensors = sensorManager.getAll();
            expect(sensors.length).to.equal(1);
            done();
        })
    });

    after(function (done) {
        sensorManager.sensors = [];
        done();
    });
});