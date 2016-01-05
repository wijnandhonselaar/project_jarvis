var webdriverio = require('webdriverio');
var chai = require('chai');
var api = require('superagent');
var Actuator = require('../models/actuator');
var rethinkManager = require('../modules/rethinkManager');
var thinky = require('thinky')();
var r = thinky.r;
var expect = chai.expect;

describe("Test scenario", function () {

    // set up the tests
    this.timeout(20000);  // prevent mocha from terminating a test to soon,
                          // when browser is slow
    var siteURL = "http://localhost:3221/";
    var browser;

    before(function (done) {
        // load the driver for browser
        browser = webdriverio.remote({
            desiredCapabilities: {
                browserName: 'chrome'
            }
        });
        browser.init(done);
    });

    before(function (done) {
        r.connect({host: 'localhost', port: 28015}, function (err, conn) {
            if (err) throw err;
            connection = conn;
            done();
        })
    });

    before(function (done) {
        r.db('jarvis').table('Scenario').
            delete().
            run(connection, function (err, result) {
                if (err) throw err;
                //console.log(JSON.stringify(result, null, 2));
                done();
            });
    });

    before(function (done) {
        r.db('jarvis').table('Actuator').
            delete().
            run(connection, function (err, result) {
                if (err) throw err;
                //console.log(JSON.stringify(result, null, 2));
                done();
            });
    });

    before(function (done) {
        device = newDevice(1000016, 'b');
        device.type = 'actuator';
        api.post('http://localhost:3221/test/devices/add')
            .send({device: device, remote: {address: '192.186.24.2'}})
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    beforeEach(function(done){
        setTimeout(function() {
            done();
        }, 1000);
    });


    it("should show the mainscreen 5 menu items", function (done) {
        browser
            .url(siteURL)
            .elements(".menu_item").then(function (result) {
                expect(result.value).to.have.length(5);
                    browser
                    .click('#scenario');
                setTimeout(function () {
                    done();
                }, 500);
            })
            .catch(function (exception) {
                console.log("EXCEPTION", exception);
                done(exception);
            })
    });
    it("should go to scenario overzicht pagina", function (done) {
        browser
            .click('#scenario')
            .getText('#newscenario').then(function (value) {
                expect(value).to.be.equal("Nieuw Scenario"); // true
                done();
            })
            .catch(function (exception) {
                console.log("EXCEPTION", exception);
                done(exception);
            });
    });
    it("should go to newpage of scenario", function (done) {
        browser
            .click('#newscenario')
            .elements('.card').then(function (result) {
                expect(result.value).to.have.length(6); // true
                done();
            })
            .catch(function (exception) {
                console.log("EXCEPTION", exception);
                done(exception);
            })
    });

    it("should fill in new scenario and open addactuator modal", function (done) {
        browser
            .setValue('#name', 'E2ETestNewScenario')
            .setValue('#description', 'E2ETestNewScenariodescription')
            .click('#addDevice')
            .getText('#commandTitle').then(function (value) {
                console.log(value);
                expect(value).to.be.equal("Apparaat toevoegen");
                done();
            })
            .catch(function (exception) {
                console.log("EXCEPTION", exception);
                done(exception);
            })
    });


    it("should click a device and add it to the scenario", function (done) {
        browser
            .click('#actuatoralias')
            .getText('#actuatorAliasactuator').then(function (value) {
                expect(value).to.be.equal("b");
                done();
            })
            .catch(function (exception) {
                console.log("EXCEPTION", exception);
                done(exception);
            })
    });

    it("should click a device option and save it to the scenario", function (done) {
        browser
            .getValue('#1000016', function (err, value) {
                expect(value).to.be.equal("c");
                done();
            })
            .catch(function (exception) {
                console.log("EXCEPTION", exception);
                done(exception);
            })
    });

    it("only Clicks and wait for callback", function (done) {
        browser
            .click('#createNew');
        setTimeout(function () {
            done();
        }, 500);
    });

    it("Should save the scenario with devices", function (done) {
        browser
            .elements("#scenarioAmount").then(function (result) {
                expect(result.value).to.have.length(1);
                done();
            })
            .catch(function (exception) {
                console.log("EXCEPTION", exception);
                done(exception);
            })
    });
    it("Should open detailpage of the scenario with devices change name", function (done) {
        browser
            .click("#scenarioAmount")
            .setValue('#name', '1')
            .setValue('#description', '2')
            .click('#scenario');
        setTimeout(function () {
            done();
        }, 2000);
    });

    it("Should see if overview is changed", function (done) {
        browser
            .getText(".description").then(function (value) {
            expect(value).to.be.equal("2..."); // true
            done();
        })
            .catch(function (exception) {
                console.log("EXCEPTION", exception);
                done(exception);
            })
    });

    it("Should delete scenario", function (done) {
        browser
            .click("#scenarioAmount")
            .click("#trashcan")
            .click('#scenario');
        setTimeout(function () {
            done();
        }, 2000);
    });
    it("Should have deleted the scenario with devices and not be seen in overview", function (done) {
        browser
            .elements("#scenarioAmount").then(function (result) {
                expect(result.value).to.have.length(0);
                done();
            })
            .catch(function (exception) {
                console.log("EXCEPTION", exception);
                done(exception);
            })
    });


    after(function (done) {
        browser.end(done);
    });
})
;


function newDevice(id, name) {
    return {
        id: id,
        name: name,
        sokVersion: 1,
        description: 'Temperatuur op 0.1c nauwkeuring',
        image: "niks",
        savedAt: 1651981981,
        commands: {
            status: {
                name: 'amigo',
                parameters: {},
                requestInterval: 5000,
                returns: {
                    Celsius: 'number',
                    Fahrenheit: 'number',
                    Kelvin: 'number'
                },
                description: "geeft de temperatuur"
            },
            on: {
                name: 'c',
                parameters: {},
                requestInterval: 5000,
                returns: {
                    Celsius: 'number',
                    Fahrenheit: 'number',
                    Kelvin: 'number'
                },
                description: "geeft de temperatuur"
            },
            off: {
                name: 'c',
                parameters: {},
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