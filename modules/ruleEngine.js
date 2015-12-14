var deviceManager = null;
var comm = require('./interperter/comm');
var conflictManager = require('./conflictManager');

function apply(scenario, event) {

    var hasRules = false;
    var statementString = '';
    var andGate = false.toString();


    if (scenario.rules.thresholds.length != 0) {
        hasRules = true;
        for (var i = 0; i < scenario.rules.thresholds.length; i++) {
            var rule = scenario.rules.thresholds[i];
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


    if (scenario.rules.timers.length != 0) {
        hasRules = true;
        for (var b = 0; b < scenario.rules.timers.length; b++) {
            var tobj = scenario.rules.timers[b];

            var timeObj = new Date;
            var temp = tobj.time.split(/\:|\-/g);
            timeObj.setHours(temp[0]);
            timeObj.setMinutes(temp[1]);
            var time = timeObj.getTime();
            var curStamp = new Date().getTime();
            var resolve = ((time < (curStamp + 5000)) && (time > (curStamp - 5000))).toString();
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

    if (scenario.rules.events.length != 0 && event) {
        hasRules = true;
        for (var c = 0; c < scenario.rules.events.length; c++) {
            var eobj = scenario.rules.events[c];
            if (eobj.device == event.id) {
                console.log('TESSSTTT');
            }
            switch (eobj.gate) {
                case 'AND':
                    andGate = (device.id == eobj.device && event.key == eobj.event).toString();
                    break;
                case 'OR':
                    statementString += ' || ' + (parseInt(eobj.device) == parseInt(event.id) && event.key == eobj.event).toString();
                    //console.log('resolve', parseInt(device.id) === parseInt(eobj.device));
                    break;
            }
        }
    }

    if (hasRules) {

        statementString = andGate + ' ' + statementString;

        if (event) console.log(statementString);

        if (eval(statementString)) {

            for (var deviceLoop = 0; deviceLoop < scenario.actuators.length; deviceLoop++) {

                var command = scenario.actuators[deviceLoop].action.command;
                var device = deviceManager.getActuatorById(scenario.actuators[deviceLoop].deviceid);

                if (checkState(command, device)) {

                    if (!conflictManager.detect(command, device, scenario)) {

                        switch (device.model.commands[command].httpMethod) {
                            case 'POST':
                                comm.post(command, device, {}, function (state) {
                                    //deviceManager.updateDeviceStatus(device.model.type, device.id, state);
                                    deviceManager.updateActuatorState(device.id, state);
                                });
                                break;
                            case 'GET':
                                comm.get(command, device, function (data) {
                                    //deviceManager.updateDeviceStatus(device.model.type, device.id, data);
                                    deviceManager.updateActuatorState(device.id, state);
                                });
                                break;

                        }
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
        conflictManager.init(this);
    },
    apply: apply
};