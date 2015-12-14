var device = null;
var sensor = null;
var ruleEngine = require('../modules/ruleEngineForDeviceCommands');
var deviceManager = require('../modules/deviceManager');


describe('RuleEngine tests', function () {

    before(function (done) {
        device = {
            "id": 0,
            "model": {
                "commands": {
                    "changeIntensity": {
                        "description": "Lamp veranderd van intensiteit.",
                        "httpMethod": "POST",
                        "name": "change intensity",
                        "parameters": {
                            "intensity": {
                                "accepts": [{
                                    "limit": [{"max": "255", "min": "0", "type": "number"}],
                                    "type": "number"
                                }], "name": "intensity", "required": true
                            },
                            "testbool": {"accepts": [{"limit": [], "type": "boolean"}], "name": "testbool", "required": true},
                            "teststring": {"accepts": [{"limit": [], "type": "string"}], "name": "teststring", "required": true}
                        },
                        "requestInterval": 5000,
                        "returns": "Boolean"
                    },
                    "off": {
                        "description": "Lamp wordt uitgezet.",
                        "httpMethod": "POST",
                        "name": "off",
                        "parameters": {},
                        "requestInterval": 5000,
                        "returns": "boolean"
                    },
                    "on": {
                        "description": "Lamp wordt aangezet.",
                        "httpMethod": "POST",
                        "name": "on",
                        "parameters": {},
                        "requestInterval": 5000,
                        "returns": "boolean"
                    },
                    "status": {
                        "description": "Haalt de status op van Lamp",
                        "httpMethod": "GET",
                        "name": "status",
                        "parameters": {},
                        "requestInterval": 5000,
                        "returns": {"intensity": "integer", "state": "boolean"}
                    }
                },
                "description": "Lamp is een geweldige actuator die bijvoorbeeld het commando status kan uitvoeren!",
                "events": ["finish", "start", "alert"],
                "id": 0,
                "image": "data:image/jpeg;base64,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",
                "name": "Lamp",
                "sokVersion": 0.1,
                "type": "actuator"
            },
            "config": {
                "active": true,
                "alias": "Triggerlamp",
                "clientRequestInterval": 5000,
                "ip": "127.0.0.1",
                "rules": {
                    "off": {"command": "off", "events": [], "thresholds": [], "timers": []},
                    "on": {"command": "on", "events": [], "thresholds": [], "timers": []}
                }
            }
        };

        var sensor = {
            "id": 10,
            "savedAt": 1450096483,
            "model": {
                "id": 10,
                "name": "LichtSensor",
                "type": "sensor",
                "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGUAAABHCAYAAAAeGInyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADZGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOkMzODNCRjdFM0YzMkUxMTFBQUJGRjM5QUQyODYwN0QxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjBDQTIxRDkyMzI0NTExRTE4RjlCRDg3QTczQzkwQjg1IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBDQTIxRDkxMzI0NTExRTE4RjlCRDg3QTczQzkwQjg1IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkM3ODNCRjdFM0YzMkUxMTFBQUJGRjM5QUQyODYwN0QxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkMz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",
                "sokVersion": 0.1,
                "description": "LichtSensor is een geweldige sensor die bijvoorbeeld het commando status kan uitvoeren!",
                "commands": {
                    "status": {
                        "name": "status",
                        "parameters": {},
                        "requestInterval": 20000,
                        "httpMethod": "GET",
                        "returns": {"Lux": "integer"},
                        "description": "Haalt de status op van LichtSensor"
                    }
                }
            },
            "config": {
                "rules": {
                    "on": {"command": "on", "timers": [], "events": [], "thresholds": []},
                    "off": {"command": "off", "timers": [], "events": [], "thresholds": []}
                }, "alias": "LichtSensor", "ip": "127.0.0.1", "clientRequestInterval": 20000
            },
            "status": {"Lux": "73"}
        };


        deviceManager.getSensor = function (id) {
            return sensor;
        };

        ruleEngine.init(deviceManager);

        done();
    });

    it('Should pass the ruleEngine on the following thresholds', function (done) {

        var rules = {
            on: {
                events: [],
                timers: [],
                thresholds: [
                    {
                        device: 10,
                        field: 'Lux',
                        operator: '>',
                        value: 10,
                        gate: 'AND'
                    }
                ]
            },
            off: {
                events: [],
                timers: [],
                thresholds: []
            }
        };

        device.config.rules = rules;

        if(ruleEngine.apply(device)) done();

    });

    it('Should NOT pass the ruleEngine on the following thresholds', function (done) {

        var rules = {
            on: {
                events: [],
                timers: [],
                thresholds: [
                    {
                        device: 10,
                        field: 'Lux',
                        operator: '<',
                        value: 10,
                        gate: 'AND'
                    }
                ]
            },
            off: {
                events: [],
                timers: [],
                thresholds: []
            }
        };

        device.config.rules = rules;

        if(!ruleEngine.apply(device)) done();

    });

});


