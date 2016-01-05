/*jslint evil: true */
var deviceManager = null;
var scenarioManager = null;
var comm = require('./interperter/comm');
var conflictManager = require('./conflictManager');

var stop = 'finish';
var start = 'start';

/**
 * applies rules on given scenario
 * @param scenario the scenario that's being checked against the set rules.
 * @param event (optional) this is given when an event is triggered.
 */
function apply(scenario, event) {
    //console.log(scenario);
    var hasRules = false;
    var statementString = '';

    function getScenarioRuleById(ruleKey, searchId) {
        var types = ["events", "thresholds", "timers"];
        var rule = null;
        types.forEach(function (type) {
            if (scenario.rules[ruleKey][type]) {
                var found = null;
                scenario.rules[ruleKey][type].forEach(function (element) {
                    if (element.id == searchId) {
                        found = element;
                    }
                });
                if (found) {
                    //console.log("Found\n",found);
                    rule = found;
                }
            }
        });
        return rule;
    }

    /**
     * Checks if given rule validates
     * @param rule
     * @returns {*}
     */
    function checkRule(rule) {
        if (rule.type) {
            hasRules = true;
            switch (rule.type) {
                case "thresholds":
                    var s = deviceManager.getSensor(parseInt(rule.device));
                    if (s.err) {
                        console.error("GETSENSOR ERROR\n", s.err);
                        return false.toString();
                    } else if (s.status) {
                        return validateStatement(s.status[rule.field], rule.value, rule.operator).toString();
                    } else {
                        console.error("NO ERROR OR STATUS\n", s);
                        return false.toString();
                    }
                    break;
                case 'timers':
                    var tobj = rule;
                    var timeObj = new Date();
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

    if (scenario.rules) {
        for (var ruleKey in scenario.rules) {
            if (scenario.rules.hasOwnProperty(ruleKey) && scenario.rules[ruleKey].andgroups) {
                var mappedAndGroups = scenario.rules[ruleKey].andgroups.map(function (andgroup) {
                    var andGroupStrings = andgroup.map(
                        function (ruleId) {
                            var scenarioRule = getScenarioRuleById(ruleKey, ruleId);
                            return checkRule(scenarioRule);
                        });
                    return "( " + andGroupStrings.join(" && ") + " )";
                });
                statementString = mappedAndGroups.join(" || ");
                if (hasRules) {
                    if (eval(statementString)) {
                        if ((!scenario.status && ruleKey === start) || (scenario.status && ruleKey === stop)) {
                            scenarioManager.execute(scenario, ruleKey);
                            //if (ruleKey === start) {
                            //    scenarioManager.start(scenario);
                            //} else {
                            //    scenarioManager.stop(scenario);
                            //}
                            //for (var deviceLoop = 0; deviceLoop < scenario.actuators.length; deviceLoop++) {
                            //    var command = scenario.actuators[deviceLoop].action.command;
                            //    var device = deviceManager.getActuator(scenario.actuators[deviceLoop].deviceid);
                            //    if (checkState(command, device)) {
                            //        if (!conflictManager.detect(command, device, scenario)) {
                            //            deviceManager.executeCommand(command, device, {});
                            //        }
                            //    }
                            //}
                        }
                    }
                }

                hasRules = false;
            }
        }
    }
}


/**
 * Validates statement
 * @param var1
 * @param var2
 * @param operator
 * @returns {*}
 */
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

module.exports = {
    init: function (dm, sm) {
        deviceManager = dm;
        conflictManager.init(null, sm);
        scenarioManager = sm;
    },
    apply: apply
};