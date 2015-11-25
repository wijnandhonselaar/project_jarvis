var expect = require('chai').expect;
var Sensor = require('../models/sensor.js');
var Actuator = require('../models/actuator.js');

describe("Models tests", function () {
	describe('Sensor', function () {
		var id = 5468;

		it('Should save a new sensor', function (done) {
			// create the new sensor
			var newsensor = new Sensor({
				id: id,
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
				},
				config: {
					ip: '192.168.0.201',
					alias: 'Temperatuur woonkamer',
					clientRequestInterval: 3000
				}
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

	describe('Actuator', function () {
		var id = 95987894;
		it('Shouldn\'t save a new actuator, no on command', function (done) {
			// create the new actuator
			var newactuator = new Actuator({
				id: id,
				name: 'Philips hue',
				type: 'actuator',
				sokVersion: 0.12,
				description: 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.',
				commands: {
					  off: {
						 name : 'off',
						 parameters: {},
						 requestInterval: 5000,
						 httpMethod: 'POST',
						 returns: 'Boolean',
						 description: 'Philips hue will be turned off'
					  },
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
					  },
					changeColor: {
						name : 'changeColor',
						parameters: {
							color: {
									name : 'color',
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
									list : ['R','G','B'] //Predefined parameter values
								},
							}
						},
						requestInterval: 5000,
						httpMethod : 'POST',
						returns: 'Boolean',
						description : 'Changes the color of the philips hue lamp'
					}
				},
				config: {
					ip: '192.168.0.202',
					alias: 'Lamp woonkamer',
				}
			});

			// save the new sensor
			Actuator.save(newactuator).then(function(res) {
				
			}).error(function(){
				done();
			});
		});

		it('Should save a new actuator', function (done) {
			// create the new actuator
			var newactuator = new Actuator({
				id: id,
				ip: '192.168.0.201',
				name: 'Philips hue',
				type: 'actuator',
				sokVersion: 0.12,
				description: 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.',
				   commands: {
					  on : {
						 name: 'on',
						 parameters: {},
						 requestInterval: 5000,
						 httpMethod: 'POST',
						 returns: 'Boolean',
						 description: 'Philips hue will be turned on'
					  },
					  off: {
						 name : 'off',
						 parameters: {},
						 requestInterval: 5000,
						 httpMethod: 'POST',
						 returns: 'Boolean',
						 description: 'Philips hue will be turned off'
					  },
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
					  },
					  changeColor: {
						 name : 'changeColor',
						 parameters: {
							color: {
								   name : 'color',
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
								  list : ['R','G','B'] //Predefined parameter values
							   },
						}
					 },
					 requestInterval: 5000,
					 httpMethod : 'POST',
					 returns: 'Boolean',
					 description : 'Changes the color of the philips hue lamp'
				  }
			   }, 
				config: {
					ip: '192.168.0.202',
					alias: 'Lamp woonkamer',
				}
		});

			// save the new sensor
			Actuator.save(newactuator).then(function(res) {
				done();
			}).error(console.log);
		});

		it('Should have a savedate', function (done) {

			// get the sensor
			Actuator.get(id).then(function(actuator) {
				// check if the savedAt exists (which is done by the model)
				expect(actuator.savedAt).to.exist;
				done();
			// something went wrong
			}).error(console.log);
		});

		it('Should have a on command', function (done) {

				// get the sensor
				Actuator.get(id).then(function(actuator) {
					// check if the savedAt exists (which is done by the model)
					expect(actuator.commands.on).to.exist;
					done();
				// something went wrong
			}).error(console.log);
		});

		it('Should have a off command', function (done) {

			// get the sensor
			Actuator.get(id).then(function(actuator) {
				// check if the savedAt exists (which is done by the model)
				expect(actuator.commands.off).to.exist;
				done();
			// something went wrong
			}).error(console.log);
		});

		it('Should have a status command', function (done) {

			// get the sensor
			Actuator.get(id).then(function(actuator) {
				// check if the savedAt exists (which is done by the model)
				expect(actuator.commands.status).to.exist;
				done();
			// something went wrong
			}).error(console.log);
		});

		it('Should delete a actuator', function (done) {

			// get the sensor
			Actuator.get(id).then(function(actuator) {

				// delete the sensor
				actuator.delete().then(function(result) {
					done();
				});
			// something went wrong
			}).error(console.log);
		});
	});
});


