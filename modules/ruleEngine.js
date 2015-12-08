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
    for (var command in device.config.rules) {
        if (device.config.rules.hasOwnProperty(command)) {

            var statementString = '';

            for (var i = 0; i < device.config.rules[command].thresholds.length; i++) {

                var rule = device.config.rules[command].thresholds[i];
                var andGate = true;
                var s = deviceManager.getSensor(rule.device);
                if(s.err){
                    console.log(s.err);
                } else if(s.status) {
                    switch (rule.gate) {
                        case 'AND':
                            andGate = validateStatement(s.status[rule.field], rule.value, rule.operator);
                            break;
                        case 'OR':
                            statementString += ' || ' + validateStatement(s.status[rule.field], rule.value, rule.operator);
                            break;
                    }

                    statementString = andGate.toString() + ' ' + statementString;
                }
            }

            var statement = eval(statementString);
            if (statement === true || statement === 'true') {
                switch (device.model.commands[command].httpMethod) {
                    case 'POST':
                        comm.post(command, device, {}, function (state) {
                            deviceManager.updateDeviceStatus(device.model.type, device.id, state);
                            deviceManager.updateActuatorState(device.id, state)
                        });
                        break;
                    case 'GET':
                        comm.get(command, device, function (data) {
                            deviceManager.updateDeviceStatus(device.model.type, device.id, data);
                            deviceManager.updateActuatorState(device.id, state)
                        });
                        break;
                }
            }
        }
    }
}

module.exports = {
    init: function(dm){
        deviceManager = dm;
    },
    apply: apply
};