var expect              = require('chai').expect;
var api                 = require('superagent');
var Scenario            = require('../models/scenario');
var ScenarioManager     = require('../modules/scenarioManager');
var id                  = null;

describe('Scenario Manager', function() {
    before(function(done) {
        //Scenario.deleteAll(function(err,res){ });
        done();
    });

    describe('#New scenario', function() {
        it('should save new scenario.', function(done) {
            ScenarioManager.new('Bedtijd', 'Zet alle lampen uit.', [{deviceid: 1, action: {command: 'on'}}], function(err,res) {
                if(err) throw err;
                expect(res.id).to.not.equal(null);
                expect(res.id).to.not.equal(undefined);
                id = res.id;
                done();
            });
        });
    });

    describe('#Get all scenarios', function() {
        it('should get all scenarios.', function(done) {
            ScenarioManager.getAll(function(err, res) {
                if(err) throw err;
                expect(res.length).gt(0);
                done();
            });
        });
    });

    describe('#Get scenario', function() {
        it('should fail getting a scenario.', function(done) {
            ScenarioManager.get(12345678,function(err, res) {
                expect(err).to.not.equal(null);
                done();
            });
        });
        it('should get scenario by id.', function(done) {
            ScenarioManager.get(id,function(err, res) {
                if(err) throw err;
                expect(res.name).to.equal('Bedtijd');
                done();
            });
        });
    });

    describe('#Update scenario', function() {
        it('Should update scenario name and description.', function(done) {
            ScenarioManager.get(id,function(err, res) {
                if(err) throw err;
                var update = new Scenario({name: 'Opstaan', description: 'Winter, dus lampen gaan aan.'});
                res.merge(update);
                ScenarioManager.update(res, function(err, res) {
                    if(err) throw err;
                    expect(res.name).to.equal('Opstaan');
                    done();
                });
            });
        });
        it('Should update scenario name and description with given id.', function(done) {
            ScenarioManager.get(id,function(err, res) {
                if(err) throw err;
                var scenario = res;
                scenario.name = 'Aangepast';
                scenario.description = 'New description';
                ScenarioManager.updateById(id, scenario, function(err, res) {
                    if(err) throw err;
                    expect(res.name).to.equal('Aangepast');
                    done();
                });
            });
        });
        it('Should not update scenario when name is undefined.', function(done) {
            ScenarioManager.get(id,function(err, res) {
                if(err) throw err;
                var update = new Scenario({name: undefined, description: 'Winter, dus lampen gaan aan.'});
                res.merge(update);
                ScenarioManager.update(res, function(err, res) {
                    if(err) done();
                });
            });
        });
    });

    after(function(done){
        //Scenario.deleteAll(function(err,res){ });
        done();
    });
});