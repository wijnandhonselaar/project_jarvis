var expect = require('chai').expect;
var Sensor = require('../models/sensor.js');

describe("Models tests", function () {
    describe('CRUD Sensor', function () {
        var id = 5468;

        it('Should save a new sensor', function (done) {
        	// create the new sensor
			var newsensor = new Sensor({
                id: id,
                alias: 'Temperatuur woonkamer',
                name: 'philips temp',
                sokVersion: 0.11,
                description: 'Temperatuur op 0.1c nauwkeuring',
                commands: [{
                    name: 'get temperature',
                    parameters: ["para", "meter"],
                    requestInterval: 5000,
                    httpMethod: "GET",
                    returns: {
                        Celsius: 'number',
                        Fahrenheit: 'number',
                        Kelvin: 'number'
                    },
                    description: "geeft de temperatuur"
                }]
            });

            // save the new sensor
            Sensor.save(newsensor).then(function(res) {
                done();
            }).error(console.log);
        });
        
        it('Should have a savedate', function (done) {

            // get the sensor
            Sensor.get(id).then(function(sensor) {
                // check if the savedAt exists (which is done by the model)
                expect(sensor.savedAt).to.exist;
                done();
            // something went wrong
            }).error(console.log);
        });

        it('Should delete a sensor', function (done) {

            // get the sensor
            Sensor.get(id).then(function(sensor) {

                // delete the sensor
                sensor.delete().then(function(result) {
                    done();
                });
            // something went wrong
            }).error(console.log);
        });
    });
});
