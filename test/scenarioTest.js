var expect = require('chai').expect;
var Scenario = require('../models/scenario');

describe('Scenario', function () {
    before(function(done) {
        Scenario.delete();
        done();
    });
    it('Shouldn\'t save an empty Scenario', function (done) {
        // create the new Scenario
        var scenario = new Scenario({});
        // save the new sensor
        Scenario.save(scenario).then(function(res) {
            //done('saved with no status object');
        }).error(function(){
            done();
        });
    });
    it('Shouldn\'t save a new Scenario, no description', function (done) {
        // create the new loh
        var scenario = new Scenario({
            name: 'name'
        });
        // save the new Scenario
        Scenario.save(scenario).then(function(res) {
        }).error(function(){
            done();
        });
    });
    it('Shouldn\'t save a new Scenario, no name', function (done) {
        // create the new Scenario
        var scenario = new Scenario({
            description: 'description'
        });
        // save the new Scenario
        Scenario.save(scenario).then(function(res) {
        }).error(function(){
            done();
        });
    });
    it('Shouldn\'t save a new Scenario, empty actuator object.', function (done) {
        // create the new Scenario
        var scenario = new Scenario({
            name: 'name',
            description: 'description',
            actuators: [{}]
        });
        // save the new Scenario
        Scenario.save(scenario).then(function(res) {
        }).error(function(){
            done();
        });
    });
    it('Shouldn\'t save a new Scenario, no actuator action.', function (done) {
        // create the new Scenario
        var scenario = new Scenario({
            name: 'name',
            description: 'description',
            actuators: [{deviceid: 1}]
        });
        // save the new Scenario
        Scenario.save(scenario).then(function(res) {
        }).error(function(){
            done();
        });
    });
    it('Shouldn\'t save a new Scenario, no actuator id.', function (done) {
        // create the new Scenario
        var scenario = new Scenario({
            name: 'name',
            description: 'description',
            actuators: [{action: "on"}]
        });
        // save the new Scenario
        Scenario.save(scenario).then(function(res) {
        }).error(function(){
            done();
        });
    });

    it('Should save a new Scenario', function (done) {
        // create the new Scenario
        var scenario = new Scenario({
            name: 'name',
            description: 'description',
        });
        // save the new Scenario
        Scenario.save(scenario).then(function(res) {
            done();
        }).error(function(err){
            console.log(err);
        });
    });
    after(function(done) {
        Scenario.delete();
        done();
    });
});


