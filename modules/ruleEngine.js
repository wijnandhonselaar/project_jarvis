var deviceManager = null;
var comm = require('./interperter/comm');

function validateStatement(var1, var2, operator) {
    var statements = {
        '>': var1 > var2,
        '>=': var1 >= var2,
        '<': var1 < var2,
        '<=': var1 <= var2,
        '==': var1 == var2,
        '===': var1 === var2,
        '!=': var1 != var2,
        '!==': var1 !== var2
    };
    return statements[operator];
}

function apply(device) {
    //console.log("device:");
    //console.log(device);
    for (var command in device.config.rules) {
        if (device.config.rules.hasOwnProperty(command)) {

            var statementString = '';
            var andGate = true;

            if (device.config.rules[command].thresholds.length != 0) {
                for (var i = 0; i < device.config.rules[command].thresholds.length; i++) {
                    var rule = device.config.rules[command].thresholds[i];
                    var s = deviceManager.getSensor(rule.device);
                    if (s.err) {
                        console.log(s.err);
                    } else if (s.status) {
                        switch (rule.gate) {
                            case 'AND':
                                andGate = validateStatement(s.status[rule.field], rule.value, rule.operator);
                                break;
                            case 'OR':
                                statementString += ' || ' + validateStatement(s.status[rule.field], rule.value, rule.operator);
                                break;
                        }
                    }
                }

                statementString += andGate + ' ' + statementString;

                if (eval(statementString) && checkState(command, device)) {
                    switch (device.model.commands[command].httpMethod) {
                        case 'POST':
                            comm.post(command, device, {}, function (state) {
                                deviceManager.updateDeviceStatus(device.model.type, device.id, state);
                                deviceManager.updateActuatorState(device.id, state);
                            });
                            break;
                        case 'GET':
                            comm.get(command, device, function (data) {
                                deviceManager.updateDeviceStatus(device.model.type, device.id, data);
                                deviceManager.updateActuatorState(device.id, state);
                            });
                            break;

                    }
                }
            }
        }
    }
}

function checkState(command, device){
    if(device.status) {
        var state = device.status.state;
        switch (command) {
            case 'on':
                if(!state){
                    return true;
                } else if (state) {
                    return false;
                }
                break;
            case 'off':
                if(!state){
                    return false;
                } else if (state) {
                    return true;
                }
                break
        }
    } else {
        return true;
    }
}

module.exports = {
    init: function (dm) {
        deviceManager = dm;
    },
    apply: apply
};