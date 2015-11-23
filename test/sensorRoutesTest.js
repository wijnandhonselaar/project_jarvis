var expect              = require('chai').expect;
var should              = require('should');
var request             = require('supertest');
var api                 = request('http://localhost:3000');
var sensorManager       = require('../classes/sensorManager');

describe('Sensor routing', function() {
    before(function (done) {
        sensorManager.add({name: 'temperature'});
        sensorManager.add({name: 'lumen'});
        done();
    });

    describe('#get all sensors', function () {
        it('should receive list of sensors', function (done) {
            api
                .get('/api/v1/sensors')
                .send()
                .expect(200) //Status code
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.body.sensors.length).to.be.above(1);
                    done();
                });
        });
    });

    after(function (done) {
        sensorManager.sensors = [];
        done();
    });
});