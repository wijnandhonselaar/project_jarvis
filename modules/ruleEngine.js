var deviceManager = null;
var comm = require('./interperter/comm');

function apply(device, event) {

    if (event) {
        console.log(event);
        console.log(device);
    }

    for (var command in device.config.rules) {
        if (device.config.rules.hasOwnProperty(command)) {

            var hasRules = false;
            var statementString = '';
            var andGate = false.toString();

            if (device.config.rules[command].thresholds.length != 0) {
                hasRules = true;
                for (var i = 0; i < device.config.rules[command].thresholds.length; i++) {
                    var rule = device.config.rules[command].thresholds[i];
                    var s = deviceManager.getSensor(parseInt(rule.device));
                    if (s.err) {
                        console.log(s.err);
                    } else if (s.status) {
                        switch (rule.gate) {
                            case 'AND':
                                andGate = validateStatement(s.status[rule.field], rule.value, rule.operator).toString();
                                break;
                            case 'OR':
                                statementString += ' || ' + validateStatement(s.status[rule.field], rule.value, rule.operator).toString();
                                break;
                        }
                    }
                }
            }


            if (device.config.rules[command].timers.length != 0) {
                hasRules = true;
                for (var b = 0; b < device.config.rules[command].timers.length; b++) {
                    var tobj = device.config.rules[command].timers[b];

                    var timeObj = new Date, temp = tobj.time.split(/\:|\-/g);
                    console.log(temp);
                    timeObj.setHours(temp[0]);
                    timeObj.setMinutes(temp[1]);
                    var time = timeObj.getTime();
                    console.log(time);
                    var curStamp = new Date().getTime();
                    var resolve = ((time < (curStamp+5000)) && (time > (curStamp-5000))).toString();
                    switch (tobj.gate) {
                        case 'AND':
                            andGate = resolve;
                            break;
                        case 'OR':
                            statementString += ' || ' + resolve;
                            break;
                    }
                }
            }

            if (device.config.rules[command].events.length != 0 && event) {
                hasRules = true;
                for (var c = 0; c < device.config.rules[command].events.length; c++) {
                    var eobj = device.config.rules[command].events[c];
                    switch (eobj.gate) {
                        case 'AND':
                            andGate = (device.id == eobj.device && event.key == eobj.event);
                            break;
                        case 'OR':
                            statementString += ' || ' + (device.id == eobj.device && event.key == eobj.event);
                            break;
                    }
                }
            }

            if (hasRules) {
                statementString = andGate + ' ' + statementString;
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

function checkState(command, device) {
    if (device.status) {
        var state = device.status.state;
        switch (command) {
            case 'on':
                if (!state) {
                    return true;
                } else if (state) {
                    return false;
                }
                break;
            case 'off':
                if (!state) {
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