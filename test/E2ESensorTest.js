var webdriverio =require('webdriverio');
var expect = require('chai').expect;
var Sensor = require('../models/sensor.js');
var api = require('superagent');


describe('Sensor overzicht/detail test', function(){
	this.timeout(10000);
	var browser;
	var id = 1000015;
    require('./globalBefore');
	before(function(done) {
		browser = webdriverio.remote({
			desiredCapabilities: {
				browserName: 'chrome'
			}
		});
		
		var device = newDevice(id, 'a');
        device.type = 'sensor';

        api.post('http://localhost:3221/test/devices/add')
        .send({device : device, remote:{address:'192.186.24.1'}})
        .end(function (err, res) {
            if(err) {
                done(err);
            }
        });

		browser.init(done);
	});

    beforeEach(function(done){
        setTimeout(function() {
            done();
        }, 500);
    });
    
	it("Should find the sensor with the correct name", function(done){
		browser.
			url("http://localhost:3221/#/sensors")
			.elements("#sensor").then( function(result){
				console.log(result);
				expect(result.value.length).to.equal(1);
			})
			.getText('#sensor').then(function(result){
				console.log(result);
				expect(result[0]).to.equal("a")
				done();	
			});
	});

	it("Should have a description", function(done){
		browser.
			url("http://localhost:3221/#/sensors")
			.leftClick('#sensor').then(function(result){})
			.getUrl().then(function(url){
				expect(url).to.equal("http://localhost:3221/#/sensors/"+id);
			})
			.getText(".description").then( function(result){
				expect(result).to.be.a("string");
				expect(result).to.be.equal("Temperatuur op 0.1c nauwkeuring")
				done();
			});
	});

	it("Should be able to change alias", function(done){
		browser.
			url("http://localhost:3221/#/sensors/"+id)
			.setValue('#alias', 't')
			.url("http://localhost:3221/#/sensors")
			.getText("#sensor").then( function(result){
				console.log(result);
				expect(result).to.be.a("string");
				expect(result[0]).to.be.equal("t")
				done();
			});
	});

	after(function (done) {
        var id= 1000015;
        Sensor.get(id).then(function(sensor) {
            sensor.delete().then(function() {
                done();
            });
        }).error(function(err){
            done(err);
        });
    });

	after(function(done){
        api
        .post("http://localhost:3221/test/devices/delete")
        .end(function(err,res) {
            if (err) {
                if(err) {
                    done(err);
                }
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
                    name: 'c',
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
                    name: 'c',
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
                    name: 'c',
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