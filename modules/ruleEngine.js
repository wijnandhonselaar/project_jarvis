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
    var hasRules = false;

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
                        return false;
                    } else if(s.status) {
                        return validateStatement(s.status[rule.field], rule.value, rule.operator);
                    } else {
                        console.error("NO ERROR OR STATUS\n", s);
                        return false;
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
                    var resolve = ((time < (curStamp + 5000)) && (time > (curStamp - 5000)));
                    return resolve;
                case 'events':
                    if (event) {
                        return (parseInt(eobj.device) == parseInt(event.id) && event.key == eobj.event);
                    } else {
                        return false;
                    }
            }
        }
    }

    if (scenario.rules) {
        for (var ruleKey in scenario.rules) {
            if (scenario.rules.hasOwnProperty(ruleKey) && scenario.rules[ruleKey].andgroups) {
                var execute = false;
                for(var i = 0; i < scenario.rules[ruleKey].andgroups.length && !execute; i++){
                    var andgroup = scenario.rules[ruleKey].andgroups[i];
                    for(var ai = 0; ai < andgroup.length; ai++) {
                        var scenarioRule = getScenarioRuleById(ruleKey,andgroup[ai]);
                        if ( !checkRule(scenarioRule) ) {
                            break;
                        }
                        if(ai+1 == andgroup.length) {
                            execute = true;
                        }
                    }
                }

                if (hasRules && execute) {
                    if ((!scenario.status && ruleKey === start) || (scenario.status && ruleKey === stop)) {
                        scenarioManager.execute(scenario,ruleKey,null);
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