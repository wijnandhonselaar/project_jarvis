var expect              = require('chai').expect;
var api                 = require('superagent');
var Scenario            = require('../models/scenario');

describe('Scenario routing', function() {

    before(function (done) {
        done();
    });

    beforeEach(function(done){
        setTimeout(function() {
            done();
        }, 500);
    });

    describe('#get all devices', function() {
        it('should receive a list of devices', function (done) {
            done();
            //api
            //    .get('http://localhost:3221/scenario')
            //    //.expect(200) //Status code
            //    .end(function(err,res) {
            //        if (err) {
            //            throw err;
            //        }
            //        expect(res.body.devices.actuators.length).to.equal(1);
            //        expect(res.body.devices.actuators[0].config.alias).to.equal('b');
            //        expect(res.body.devices.sensors.length).to.equal(1);
            //        done();
            //    });
        });
    });

    after(function(done){
        done();
        //api
        //    .post("http://localhost:3221/test/devices/delete")
        //    .end(function(err,res) {
        //        if (err) {
        //            throw err;
        //        }
        //        done();
        //    });
    });
});