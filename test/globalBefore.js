/**
 * Created by esper on 4-1-16.
 */
var thinky = require('thinky')();
var r = thinky.r;
var connection = null;
var api       = require('superagent');


before(function(done){
    r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
        if(err) {
            done(err);
        }
        connection = conn;
        done();
    })
});

before(function(done){
    r.db('jarvis').table('Actuator').
    delete().
    run(connection, function(err, result) {
        if(err) {
            done(err);
        }
        console.log('deleted actuator table');
        done();
    });
});

before(function(done){
    r.db('jarvis').table('Sensor').
    delete().
    run(connection, function(err, result) {
        if (err) throw err;
        console.log('deleted sensor table');
        done();
    });
});

before(function(done){
    r.db('jarvis').table('Scenario').
    delete().
    run(connection, function(err, result) {
        if (err) throw err;
        console.log('deleted scenario table');
        done();
    });
});

before(function(done){
    api
        .post("http://localhost:3221/test/devices/delete")
        .end(function(err,res) {
            if (err) {
                done(err);
            }
            console.log('deleted devices in app.js');
            done();
        });
});