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

    describe('#new scenario', function() {
        it('should create a new scenario', function(done) {
           api
               .post('http://localhost:3221/scenario')
               .send({
                   name: 'Thuiskomst',
                   description: 'Verwarming aan, koffiezet apparaat aan.',
                   actuators: JSON.stringify([{deviceid: 1, action: {command: 'on'}}])})
               .end(function(err,res) {
                    if (err) throw err;
                    done();
               });
        });
    });

    describe('#get all scenario\'s', function() {
        it('should receive a list of scenario\'s', function (done) {
            api
                .get('http://localhost:3221/scenario')
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    done();
                });
        });
    });

    describe('#get scenario', function() {
        it('should get scenario by id', function (done) {
            var scenario = null;
            api
                .get('http://localhost:3221/scenario')
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    scenario = res.body.scenarios[0];
                    console.log(scenario);
                    api
                        .get('http://localhost:3221/scenario/'+scenario.id)
                        .end(function(err,res) {
                            if (err) {
                                throw err;
                            }
                            expect(res.body.scenario.name).to.equal(scenario.name);
                            done();
                        });
                });
        });
    });

    describe('#update scenario', function() {
        it('should update a scenario', function (done) {
            var scenario = null;
            api
                .get('http://localhost:3221/scenario')
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    scenario = res.body.scenarios[0];
                    console.log(scenario);
                    scenario.name = 'Aangepast';
                    api
                        .put('http://localhost:3221/scenario/'+scenario.id)
                        .send({scenario: scenario})
                        .end(function(err,res) {
                            if (err) throw err;
                            expect(res.body.scenario.name).to.equal(scenario.name);
                            done();
                        });
                });
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