var expect = require('chai').expect;
var Sensor = require('../models/sensor.js');
var Actuator = require('../models/actuator.js');

describe("Models tests", function () {
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
				}
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
				}
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
				expect(sensor.model.savedAt).to.exist;
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

	describe('Actuator', function () {
		var id = 95987894;
		it('Shouldn\'t save a new actuators, no on command', function (done) {
			// create the new actuators
			var newactuator = new Actuator({
				id: id,
				model: {
					name: 'Philips hue',
					type: 'actuator',
					sokVersion: 0.12,
					description: 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.',
					commands: {
						off: {
							name: 'off',
							parameters: {},
							requestInterval: 5000,
							httpMethod: 'POST',
							returns: 'Boolean',
							description: 'Philips hue will be turned off'
						},
						status: {
							name: 'status',
							parameters: {},
							requestInterval: 5000,
							httpMethod: 'GET',
							returns: {
								Celsius: 'Number',
								Fahrenheit: 'Number',
								Kelvin: 'Number'
							},
							description: 'Retrieves status of philips hue lamp'
						},
						changeColor: {
							name: 'changeColor',
							parameters: {
								color: {
									name: 'color',
									required: true,
									accepts: {
										type: 'hex',
										limit: [
											{
												type: 'hex',
												min: '0x000000',
												max: '0xffffff'
											}
										],
										list: ['R', 'G', 'B'] //Predefined parameter values
									},
								}
							},
							requestInterval: 5000,
							httpMethod: 'POST',
							returns: 'Boolean',
							description: 'Changes the color of the philips hue lamp'
						}
					}
				},
				config: {
					ip: '192.168.0.202',
					alias: 'Lamp woonkamer',
				}
			});

			// save the new sensors
			Actuator.save(newactuator).then(function(res) {
				
			}).error(function(){
				done();
			});
		});

		it('Should save a new actuators', function (done) {
			// create the new actuators
			var newactuator = new Actuator({
				id: id,
				model: {
					ip: '192.168.0.201',
					name: 'Philips hue',
					type: 'actuator',
					sokVersion: 0.12,
					description: 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.',
					commands: {
						on: {
							name: 'on',
							parameters: {},
							requestInterval: 5000,
							httpMethod: 'POST',
							returns: 'Boolean',
							description: 'Philips hue will be turned on'
						},
						off: {
							name: 'off',
							parameters: {},
							requestInterval: 5000,
							httpMethod: 'POST',
							returns: 'Boolean',
							description: 'Philips hue will be turned off'
						},
						status: {
							name: 'status',
							parameters: {},
							requestInterval: 5000,
							httpMethod: 'GET',
							returns: {
								Celsius: 'Number',
								Fahrenheit: 'Number',
								Kelvin: 'Number'
							},
							description: 'Retrieves status of philips hue lamp'
						},
						changeColor: {
							name: 'changeColor',
							parameters: {
								color: {
									name: 'color',
									required: true,
									accepts: {
										type: 'hex',
										limit: [
											{
												type: 'hex',
												min: '0x000000',
												max: '0xffffff'
											}
										],
										list: ['R', 'G', 'B'] //Predefined parameter values
									},
								}
							},
							requestInterval: 5000,
							httpMethod: 'POST',
							returns: 'Boolean',
							description: 'Changes the color of the philips hue lamp'
						}
					}
				},
				config: {
					ip: '192.168.0.202',
					alias: 'Lamp woonkamer',
				}
		});

			// save the new sensors
			Actuator.save(newactuator).then(function(res) {
				done();
			}).error(console.log);
		});

		it('Should have a savedate', function (done) {

			// get the sensors
			Actuator.get(id).then(function(actuator) {
				// check if the savedAt exists (which is done by the model)
				expect(actuator.model.savedAt).to.exist;
				done();
			// something went wrong
			}).error(console.log);
		});

		it('Should have a on command', function (done) {

				// get the sensors
				Actuator.get(id).then(function(actuator) {
					// check if the savedAt exists (which is done by the model)
					expect(actuator.model.commands.on).to.exist;
					done();
				// something went wrong
			}).error(console.log);
		});

		it('Should have a off command', function (done) {

			// get the sensors
			Actuator.get(id).then(function(actuator) {
				// check if the savedAt exists (which is done by the model)
				expect(actuator.model.commands.off).to.exist;
				done();
			// something went wrong
			}).error(console.log);
		});

		it('Should have a status command', function (done) {

			// get the sensors
			Actuator.get(id).then(function(actuator) {
				// check if the savedAt exists (which is done by the model)
				expect(actuator.model.commands.status).to.exist;
				done();
			// something went wrong
			}).error(console.log);
		});

		it('Should delete a actuators', function (done) {

			// get the sensors
			Actuator.get(id).then(function(actuator) {

				// delete the sensors
				actuator.delete().then(function(result) {
					done();
				});
			// something went wrong
			}).error(console.log);
		});
	});
});

