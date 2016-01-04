/**
 * Created by esper on 4-1-16.
 */
var thinky = require('thinky')();
var r = thinky.r;
var connection = null;


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
