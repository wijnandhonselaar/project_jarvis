var deviceManager = null;
var scenarioManager = null;
var comm = require('./interperter/comm');
var conflictManager = require('./conflictManager');

var stop = 'finish';
var start = 'start';

function apply(scenario, event) {
    console.log(scenario);
    var hasRules = false;
    var statementString = '';

    function getScenarioRuleById(ruleKey,searchId) {
        var types = [ "events", "thresholds", "timers" ];
        var rule = null;
        types.forEach(function(type){
            if(scenario.rules[ruleKey][type]) {
                console.log("DIT DING \n", scenario.rules[ruleKey][type]);
                var found = null;
                scenario.rules[ruleKey][type].forEach(function(element){
                    if(element.id == searchId) {
                        found = element;
                    }
                });
                if (found) {
                    console.log("Found\n",found);
                    rule = found;
                }
            }
        });
        return rule;
    }

    function checkRule(rule) {
        if(rule.type) {
            hasRules = true;
            switch (rule.type) {
                case "thresholds":
                    var s = deviceManager.getSensor(parseInt(rule.device));
                    if(s.err) {
                        console.error("GETSENSOR ERROR\n", s.err);
                        return false.toString();
                    } else if(s.status) {
                        return validateStatement(s.status[rule.field], rule.value, rule.operator).toString();
                    } else {
                        console.error("NO ERROR OR STATUS\n", s);
                        return false.toString();
                    }
                case 'timers':
                    var tobj = rule;
                    var timeObj = new Date;
                    var temp = tobj.time.split(/\:|\-/g);
                    timeObj.setHours(temp[0]);
                    timeObj.setMinutes(temp[1]);
                    var time = timeObj.getTime();
                    var curStamp = new Date().getTime();
                    var resolve = ((time < (curStamp + 5000)) && (time > (curStamp - 5000))).toString();
                    return resolve;
                case 'events':
                    if (event) {
                        return (parseInt(eobj.device) == parseInt(event.id) && event.key == eobj.event).toString();
                    } else {
                        return false.toString();
                    }
            }
        }
    }

    if(scenario.rules) {
        for (var ruleKey in scenario.rules) {
            if (scenario.rules.hasOwnProperty(ruleKey) && scenario.rules[ruleKey].andgroups) {
                var mappedAndGroups = scenario.rules[ruleKey].andgroups.map(function(andgroup){
                    var andGroupStrings = andgroup.map(function(ruleId){
                        var scenarioRule = getScenarioRuleById(ruleKey,ruleId);
                        return checkRule(scenarioRule);
                    });
                    return "( " + andGroupStrings.join(" && ") + " )";
                });
                statementString = mappedAndGroups.join(" || ");

                console.log("STATEMENT\n",statementString);

                if (hasRules) {
                    if (eval(statementString)) {
                        console.log("EVALUATED");
                        if ((!scenario.status && ruleKey === start) || (scenario.status && ruleKey === stop)) {
                            if (ruleKey === start) {
                                scenarioManager.start(scenario);
                            } else {
                                scenarioManager.stop(scenario);
                            }
                            for (var deviceLoop = 0; deviceLoop < scenario.actuators.length; deviceLoop++) {
                                var command = scenario.actuators[deviceLoop].action.command;
                                var device = deviceManager.getActuator(scenario.actuators[deviceLoop].deviceid);
                                if (checkState(command, device)) {
                                    if (!conflictManager.detect(command, device, scenario)) {
                                        deviceManager.executeCommand(command, device, {});
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    //var hasRules = false;
    //var statementString = '';
    //var andGate = false.toString();
    //
    //if (scenario.rules) {
    //    for (var ruleKey in scenario.rules) {
    //        if (scenario.rules.hasOwnProperty(ruleKey)) {
    //            if (scenario.rules[ruleKey].thresholds.length != 0) {
    //                hasRules = true;
    //                for (var i = 0; i < scenario.rules[ruleKey].thresholds.length; i++) {
    //                    var rule = scenario.rules[ruleKey].thresholds[i];
    //                    var s = deviceManager.getSensor(parseInt(rule.device));
    //                    if (s.err) {
    //                        console.log(s.err);
    //                    } else if (s.status) {
    //                        switch (rule.gate) {
    //                            case 'AND':
    //                                andGate = validateStatement(s.status[rule.field], rule.value, rule.operator).toString();
    //                                break;
    //                            case 'OR':
    //                                statementString += ' || ' + validateStatement(s.status[rule.field], rule.value, rule.operator).toString();
    //                                break;
    //                        }
    //                    }
    //                }
    //            }
    //
    //
    //            if (scenario.rules[ruleKey].timers.length != 0) {
    //                hasRules = true;
    //                for (var b = 0; b < scenario.rules[ruleKey].timers.length; b++) {
    //                    var tobj = scenario.rules[ruleKey].timers[b];
    //
    //                    var timeObj = new Date;
    //                    var temp = tobj.time.split(/\:|\-/g);
    //                    timeObj.setHours(temp[0]);
    //                    timeObj.setMinutes(temp[1]);
    //                    var time = timeObj.getTime();
    //                    var curStamp = new Date().getTime();
    //                    var resolve = ((time < (curStamp + 5000)) && (time > (curStamp - 5000))).toString();
    //                    switch (tobj.gate) {
    //                        case 'AND':
    //                            andGate = resolve;
    //                            break;
    //                        case 'OR':
    //                            statementString += ' || ' + resolve;
    //                            break;
    //                    }
    //                }
    //            }
    //
    //            if (scenario.rules[ruleKey].events.length != 0 && event) {
    //                hasRules = true;
    //                for (var c = 0; c < scenario.rules[ruleKey].events.length; c++) {
    //                    var eobj = scenario.rules[ruleKey].events[c];
    //                    switch (eobj.gate) {
    //                        case 'AND':
    //                            andGate = (device.id == eobj.device && event.key == eobj.event).toString();
    //                            break;
    //                        case 'OR':
    //                            statementString += ' || ' + (parseInt(eobj.device) == parseInt(event.id) && event.key == eobj.event).toString();
    //                            break;
    //                    }
    //                }
    //            }
    ////
    //            if (hasRules) {
    //                if (eval(statementString)) {
    //                    if ((!scenario.status && ruleKey === start) || (scenario.status && ruleKey === stop)) {
    //                        if (ruleKey === start) {
    //                            scenarioManager.start(scenario);
    //                        } else {
    //                            scenarioManager.stop(scenario);
    //                        }
    //                        for (var deviceLoop = 0; deviceLoop < scenario.actuators.length; deviceLoop++) {
    //                            var command = scenario.actuators[deviceLoop].action.command;
    //                            var device = deviceManager.getActuator(scenario.actuators[deviceLoop].deviceid);
    //                            if (checkState(command, device)) {
    //                                if (!conflictManager.detect(command, device, scenario)) {
    //                                    deviceManager.executeCommand(command, device, {});
    //                                }
    //                            }
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //    }
    //}
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
    init: function (dm, sm) {
        deviceManager = dm;
        conflictManager.init(null, sm);
        scenarioManager = sm;
    },
    apply: apply
};