var webdriverio = require('webdriverio');
var chai = require('chai');
var api = require('superagent');
var Actuator = require('../models/actuator');
var rethinkManager = require('../modules/rethinkManager');
var thinky = require('thinky')();
var r = thinky.r;
var expect = chai.expect;

describe("Scenario E2E Test scenario", function () {

    // set up the tests
    this.timeout(10000);  // prevent mocha from terminating a test to soon,
                          // when browser is slow
    var siteURL = "http://localhost:3221/";
    var browser;
    require('./globalBefore');
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
            if (err) {
                done(err);
            }
            connection = conn;
            done();
        })
    });

    before(function (done) {
        r.db('jarvis').table('Scenario').
            delete().
            run(connection, function (err, result) {
                if (err) {
                    done(err);
                }
                //console.log(JSON.stringify(result, null, 2));
                done();
            });
    });

    before(function (done) {
        r.db('jarvis').table('Actuator').
            delete().
            run(connection, function (err, result) {
                if (err) {
                    done(err);
                }
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
                    done(err);
                }
                done();
            });
    });

    beforeEach(function (done) {
        setTimeout(function () {
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
                expect(value).to.be.equal("on");
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
            .click("#scenarioAmount");
        setTimeout(function () {
            browser
                .setValue("#name", 1)
                .setValue("#description", 2);

            setTimeout(function () {
                done();
            }, 500);
        }, 2500)

    });


    it("Should open detailpage of the scenario and go to create a rule", function (done) {
        browser
            .click("#scenarioAmount");
        setTimeout(function () {
            browser
                .click('#rules')
                .getText("#scenarioName").then(function (value) {
                    expect(value).to.be.equal("Scenario: 1"); // true
                    done();
                });
        }, 1500);

    });
    it("Should select start of a rule ", function (done) {
        browser
            .click('//*[@id="selectStartFinish"]/option[@value="start"]')
            .getValue('#selectStartFinish', function (err, value) {
                expect(value).to.be.equal("start"); // true
                done();
            })
    });


    it("Should open a new rule modal", function (done) {
        browser
            .click("#timer")
            .getText("#Rule").then(function (value) {
                expect(value).to.be.equal("Tijdklok - 1 start"); // true
                done();
            });
    });

    it("Should add rule to scenario and ready to save", function (done) {
        browser
            .setValue('#timerName', 'Timer')
            .click("#timepicker")
            .click(".ui-timepicker-am")
            .click('#Rule')
            .getValue("#timerName").then(function (value) {
                expect(value).to.be.equal("Timer"); // true
                done();
            });

    });
    it("Should save rule to scenario and see if is correctly set", function (done) {
        browser
            .click("#modalbewaren")
            .elements("#rulesamount").then(function (result) {
                expect(result.value.length).to.be.equal(1);
                done();
            })
    });

    it("Should save the entire rule to scenario", function (done) {
        browser
            .click("#save");
        setTimeout(function () {
            done();
        }, 2000);
    });

    it("Should see if overview is changed", function (done) {
        browser.click("#scenario");
        setTimeout(function () {
            browser
                .getText("#scenarioName").then(function (value) {
                    expect(value).to.be.equal("1"); // true
                    done();
                })
        }, 2500)
    });

    it("Should delete scenario", function (done) {
        browser
            .click('#scenario');
        setTimeout(function () {
            browser
                .click("#scenarioAmount")
                .click("#trashcan")
                .click('#scenario');
            setTimeout(function () {
                done();
            }, 2000);
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
        r.db('jarvis').table('Actuator').
            delete().
            run(connection, function (err, result) {
                if (err) throw err;
                //console.log(JSON.stringify(result, null, 2));
                done();
            });
    });
    after(function (done) {
        r.db('jarvis').table('Sensor').
            delete().
            run(connection, function (err, result) {
                if (err) throw err;
                //console.log(JSON.stringify(result, null, 2));
                done();
            });
    });
    after(function(done){
        setTimeout(function () {
            browser.end(done);
        }, 2000);
    });

});


function newDevice(id, name) {
    return {
        id: id,
        name: name,
        sokVersion: 1,
        description: 'Temperatuur op 0.1c nauwkeuring',
        image: "data:image/png;base64,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",
        savedAt: 1651981981,
        commands: {
            status: {
                name: 'status',
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
                name: 'on',
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
                name: 'off',
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

