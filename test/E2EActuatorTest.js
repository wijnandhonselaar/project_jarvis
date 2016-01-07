var webdriverio =require('webdriverio');
var expect = require('chai').expect;
var Sensor = require('../models/actuator.js');
var api = require('superagent');


describe('Actuator overzicht/detail test', function(){
	this.timeout(10000);
	var browser;
	var id = 1000015;

	before(function(done) {
		browser = webdriverio.remote({
			desiredCapabilities: {
				browserName: 'chrome'
			}
		});
		
		var device = newDevice(id, 'a');
        device.type = 'actuator';

        api.post('http://localhost:3221/test/devices/add')
        .send({device : device, remote:{address:'192.186.24.1'}})
        .end(function (err, res) {
            if (err) { throw err;}
        });

		browser.init(done);
	});

	it("Should find the actuator with the correct name", function(done){
		browser.
			url("http://localhost:3221/#/actuators")
			.elements("#actuator").then( function(result){
				expect(result.value.length).to.equal(1);
			})
			.getText('#actuator').then(function(result){
				expect(result[0]).to.equal("a")
				done();	
			});
	});

	it("Should have a description", function(done){
		browser.
			url("http://localhost:3221/#/actuators")
			.leftClick('#actuator').then(function(result){})
			.getUrl().then(function(url){
				expect(url).to.equal("http://localhost:3221/#/actuators/"+id);
			})
			.getText(".description").then( function(result){
				expect(result).to.be.a("string");
				expect(result).to.be.equal("Temperatuur op 0.1c nauwkeuring")
				done();
			});
	});

	it("Should be able to change alias", function(done){
		browser.
			url("http://localhost:3221/#/actuators/"+id)
			.setValue('#aliasAct', 't')
			.url("http://localhost:3221/#/actuators")
			.getText("#actuator").then( function(result){
				expect(result).to.be.a("string");
				expect(result[0]).to.be.equal("t")
				done();
			});
	});

    it("Should have commands", function(done){
        browser.
            url("http://localhost:3221/#/actuators/"+id)
            .elements(".actuatorCommand").then( function(result){
               expect(result.value.length).to.equal(2);
                done();
            });
    });

    it("Should execute on command", function(done){
        browser.
            url("http://localhost:3221/#/actuators/"+id)
            .leftClick('#on').then(function(result){})
            .elements(".green").then( function(result){
                expect(result.value.length).to.equal(1);
                done();
            });
    });

    it("Should execute off command", function(done){
        browser.
            url("http://localhost:3221/#/actuators/"+id)
            .leftClick('#off').then(function(result){console.log(result)})
            .elements(".red").then( function(result){
                expect(result.value.length).to.equal(1);
                done();
            });
    });

	after(function (done) {
        var id= 1000015;
        Sensor.get(id).then(function(sensor) {
            sensor.delete().then(function() {
                done();
            });
        }).error();
    });

	after(function(done){
        api
        .post("http://localhost:3221/test/devices/delete")
        .end(function(err,res) {
            if (err) {
                throw err;
            }
            done();
        });
    });

	after(function(done){
		browser.end(done);
	});
});

function newDevice(id, name ) {
    return {id: id,
            name: name,
            sokVersion: 1,
            description: 'Temperatuur op 0.1c nauwkeuring',
            image: "niks",
            savedAt: 1651981981,
            commands: {
                status:{
                    name: 'status',
                    parameters:{},
                    requestInterval: 5000,
                    returns: {
                        Celsius: 'number',
                        Fahrenheit: 'number',
                        Kelvin: 'number'
                    },
                    description: "geeft de temperatuur"
                },
                on:{
                    name: 'on',
                    parameters:{},
                    requestInterval: 5000,
                    returns: {
                        Celsius: 'number',
                        Fahrenheit: 'number',
                        Kelvin: 'number'
                    },
                    description: "geeft de temperatuur"
                },
                off:{
                    name: 'off',
                    parameters:{},
                    requestInterval: 5000,
                    returns: {
                        Celsius: 'number',
                        Fahrenheit: 'number',
                        Kelvin: 'number'
                    },
                    description: "geeft de temperatuur"
                }
            }
        }
}