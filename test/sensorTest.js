var expect = require('chai').expect;
var Sensor = require('../models/sensor.js');

describe('Sensor', function () {
	var id = 5468;
	it('Should\'t save a new sensor, no status command', function (done) {
		// create the new sensor
		var newsensor = new Sensor({
			id: id,
			model: {
				name: 'philips temp',
				sokVersion: 0.11,
				description: 'Temperatuur op 0.1c nauwkeuring',
				commands: {}

			},
			config: {
				ip: '192.168.0.201',
				alias: 'Temperatuur woonkamer',
				clientRequestInterval: 3000
			},
			savedAt: 5449848949
		});

		// save the new sensor
		Sensor.save(newsensor).then(function(res) {
			//done('saved with no status object');
		}).error(function(){
			done();
		});
	});


	it('Should save a new sensor', function (done) {
		// create the new sensor
		var newsensor = new Sensor({
			id: id,
			model: {
				name: 'philips temp',
				sokVersion: 0.11,
				description: 'Temperatuur op 0.1c nauwkeuring',
				commands: {
					  status: {
						 name : 'status',
						 parameters: {},
						 requestInterval: 5000,
						 httpMethod: 'GET',
						 returns: {
							Celsius: 'Number',
							Fahrenheit: 'Number',
							Kelvin: 'Number'
						 },
						 description: 'Retrieves status of philips hue lamp'
					}
				}
			},
			config: {
				ip: '192.168.0.201',
				alias: 'Temperatuur woonkamer',
				clientRequestInterval: 3000
			},
			savedAt: 5449848949
		});

		// save the new sensors
		Sensor.save(newsensor).then(function(res) {
			done();
		}).error(console.log);
	});

	it('Should have a savedate', function (done) {

		// get the sensors
		Sensor.get(id).then(function(sensor) {
			// check if the savedAt exists (which is done by the model)
			expect(sensor.savedAt).to.exist;
			done();
		// something went wrong
	}).error(console.log);
	});

	it('Should delete a sensors', function (done) {

		// get the sensors
		Sensor.get(id).then(function(sensor) {

			// delete the sensors
			sensor.delete().then(function(result) {
				done();
			});
		// something went wrong
	}).error(console.log);
	});
});


