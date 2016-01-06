var expect              = require('chai').expect;
var settingManager              = require('../modules/settingManager');
var Settings             = require('../models/settings');


describe('settingManager', function() {
    require('./globalBefore');
    before(function(done) {
        Settings.get(1).then(function(settings) {
            settings.delete().then(function(result) {
                done();
            });
        }).catch(function(){
            done();
        });
    });

    describe('#no settings exists, should create new settings', function() {
        it('should create the setting and even get the default value.', function(done) {
            settingManager.getLogLevel(function(err,res) {
                if(err) {
                    done(err);
                }
                expect(res).to.equal(4);//default is 4..
                done();
            });
        });
    });

    describe('#update the log level', function() {
        it('should update the log level.', function(done) {
            var loglevel = 2;
            settingManager.setLogLevel(loglevel, function(err,res) {
                if(err) {
                    done(err);
                }
                expect(res.logLevel).to.equal(loglevel);
                done();
            });
        });
    });


    after(function(done){
        Settings.get(1).then(function(res) {
            res.delete().then(function(result) {
                done();
            });
        });
    });
});