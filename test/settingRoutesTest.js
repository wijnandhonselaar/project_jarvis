var expect              = require('chai').expect;
var api                 = require('superagent');
//var thinky              = require('thinky')();
//var r                   = thinky.r;
var connection          = null;

describe('#Settings', function() {
    require('./globalBefore');

    it('should receive the default log level', function (done) {
        api
            .get('http://localhost:3221/settings/loglevel')
            .end(function(err,res) {
                if (err) {
                    throw err;
                }
                expect(res.status).to.equal(200);
                expect(res.body.loglevel).to.equal(4); // default log level.
                done();
            });
    });

    it('shouldn\'t put the log level because level is to high', function (done) {
        api
            .put('http://localhost:3221/settings/loglevel')
            .send({logLevel: 7})
            .end(function(err,res) {
                if (err) {
                    throw err;
                }
                expect(res.body.error).to.exist;
                done();
            });
    });

    it('shouldn\'t put the log level because level is to low', function (done) {
        api
            .put('http://localhost:3221/settings/loglevel')
            .send({logLevel: 0})
            .end(function(err,res) {
                if (err) {
                    throw err;
                }
                expect(res.body.error).to.exist;
                done();
            });
    });


    it('should put the log level', function (done) {
        var loglevel = 3;
        api
            .put('http://localhost:3221/settings/loglevel')
            .send({logLevel: loglevel})
            .end(function(err,res) {
                if (err) {
                    throw err;
                }
                expect(res.body.logLevel).to.equal(loglevel);
                done();
            });
    });
});