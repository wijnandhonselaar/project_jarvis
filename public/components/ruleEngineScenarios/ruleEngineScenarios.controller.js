(function () {
    //'use strict';
    angular
        .module('jarvis.ruleEngineScenarios')
        .controller('ruleEngineScenariosCtrl', ruleEngineScenariosCtrl);

    ruleEngineScenariosCtrl.$inject = ["DevicesService", "$stateParams", "$scope", '$timeout', '$http', 'ScenarioService'];

    function ruleEngineScenariosCtrl(DS, $sp, $scope, $timeout, $http, ScenarioService) {
        var rec = this;
        rec.scenario = $sp.data;
        console.log("scen:\n", rec.scenario);
        rec.sensors = [];
        rec.actuators = [];
        rec.openModal = openModal;
        rec.getActuatorById = getActuatorById;
        rec.showDetail = showDetail;
        rec.getSensorById = getSensorById;
        rec.selectedSensor = null;
        rec.selectedActuator = null;
        rec.selectedCommand = null;
        rec.closeModal = closeModal;
        rec.updateFieldList = updateFieldList;
        rec.addToThresholds = addToThresholds;
        rec.getSensorFields = getSensorFields;
        rec.updateEventList = updateEventList;
        rec.translateOperator = translateOperator;
        rec.remove = remove;

        rec.currentGroups = [];
        rec.recalculateGroups = recalculateGroups;
        rec.getRuleIcon = getRuleIcon;
        rec.saveAll = saveAll;

        if (!rec.scenario.rules) {
            rec.scenario.rules = {
                start: {
                    timers: [],
                    events: [],
                    thresholds: []
                },
                finish: {
                    timers: [],
                    events: [],
                    thresholds: []
                }
            };
        }

        rec.timePickerOptions = {
            step: 20,
            timeFormat: 'g:ia',
            appendTo: 'body'
        };

        rec.timer = {
            name: null,
            time: null,
            gate: 'OR'
        };

        rec.threshold = {
            device: null,
            field: null,
            operator: null,
            value: null,
            gate: 'AND'
        };

        rec.event = {
            device: null,
            event: null,
            gate: 'OR'
        };

        function recalculateGroups(groups) {
            console.log("groups\n", groups);
            var isGroups = true;
            if( !groups ) {
                rec.currentGroups = [];
                return false;
            }
            var indexedGroups = [];
            var types = [ "events", "thresholds", "timers" ];

            groups.forEach(function(group){
                if( !group ) {
                    isGroups = false;
                    return false;
                }
                var returnRules = [];

                group.forEach(function(ruleID){
                    var newRule = null;

                    types.forEach(function(type){

                        if( rec.ruleObjects[rec.selectedCommand].hasOwnProperty(type) ){
                            rec.ruleObjects[rec.selectedCommand][type].forEach(function(rule){
                                if(rule.id == ruleID){
                                    newRule = rule;
                                    newRule.type = type;
                                }
                            });
                        }
                    });
                    if (!newRule) {
                        Materialize.toast("Could not load rule " + ruleID,4000);
                    } else {
                        returnRules.push(newRule);
                    }
                });

                indexedGroups.push(returnRules);
            });

            if(isGroups) {
                rec.currentGroups = indexedGroups;
            } else {
                rec.currentGroups = [];
            }

            $timeout(draggable);
        }

        function draggable() {
            $(".recgrouprule").draggable({
                revert: true
            });
            $(".recbody").droppable({
                drop: function(event, ui){
                    var $d = $(ui.draggable);
                    var dGroupIndex     = parseInt( $d.attr("data-groupindex") );
                    var dOwnIndex       = parseInt( $d.attr("data-ownindex") );

                    var newgroup = [];
                    newgroup.push( rec.currentGroups[dGroupIndex][dOwnIndex] );
                    rec.currentGroups.push(newgroup);
                    rec.currentGroups[dGroupIndex].splice(dOwnIndex,1);

                    if (rec.currentGroups[dGroupIndex].length === 0) rec.currentGroups.splice(dGroupIndex,1);

                    $scope.$apply();
                    draggable();
                }
            });
            $(".recgroup").droppable({
                greedy: true,
                drop: function(event, ui){
                    var $d = $(ui.draggable);
                    var newGroupIndex   = parseInt( $(this).attr("data-groupindex") );
                    var dGroupIndex     = parseInt( $d.attr("data-groupindex") );
                    var dOwnIndex       = parseInt( $d.attr("data-ownindex") );

                    if ( newGroupIndex === dGroupIndex ) return false;

                    rec.currentGroups[newGroupIndex].push( rec.currentGroups[dGroupIndex][dOwnIndex] );
                    rec.currentGroups[dGroupIndex].splice(dOwnIndex,1);

                    if (rec.currentGroups[dGroupIndex].length === 0) rec.currentGroups.splice(dGroupIndex,1);

                    $scope.$apply();
                    draggable();
                }
            });
        }
        $timeout(draggable);

        function getRuleIcon(rule) {
            switch(rule.type) {
                case "thresholds":
                    return "images/icon_condition.png";
                case "events":
                    return "https://cdn3.iconfinder.com/data/icons/time/100/alarm_bell_1-512.png";
                case "timers":
                    return "http://simpleicon.com/wp-content/uploads/clock-time-1.png";
                default:
                    return "";
            }
        }

        function saveAll() {
            var andgroups = rec.currentGroups.map(function(group){
                return group.map(function(rule){
                    return rule.id;
                });
            });
            console.log("TEST:\n", andgroups);
            rec.scenario.rules[rec.selectedCommand].andgroups = andgroups;
            console.log("scenario:\n",rec.scenario.rules);

            ScenarioService.update(rec.scenario.id, rec.scenario)
                .then(function (data) {
                    return data;
                })
                .catch(function (err) {
                    console.error(err);
                });
            //DS.updateRules(rec.actuator.id, rec.ruleObjects);
        }

        function remove(type, ruleID, modal) {
            var obj = rec.ruleObjects[rec.selectedCommand][type];
            console.log(obj);
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].id == ruleID) {
                    obj.splice(i, 1);
                    closeModal(modal);
                }
            }
            reset();
        }

        function showDetail(rule) {
            var type = rule.type.slice(0, -1);
            rec[type] = rule;

            if(type == "threshold") {
                type = "rule";
            }

            $('#' + type + 'Modal').openModal({
                complete: function() { reset(); }
            });
        }

        function closeModal(modal) {
            console.log(modal);
            $('#' + modal).closeModal();
        }

        function openModal(modal) {
            $('#' + modal).openModal();
        }

        function translateOperator(operator) {
            var r = '';
            switch (operator) {
                case '>':
                    r = 'groter dan';
                    break;
                case '<':
                    r = 'kleiner dan';
                    break;
                case '===':
                    r = 'gelijk aan';
                    break;
            }
            return r;
        }

        function getSensorById(id) {
            for (var i = 0; i < rec.sensors.length; i++) {
                if (rec.sensors[i].id == id) {
                    return rec.sensors[i];
                }
            }
        }

        function getSensorFields(id) {
            for (var i = 0; i < rec.sensors.length; i++) {
                if (rec.sensors[i].id == id) {
                    //console.log(rec.sensors[i].model.commands.status.returns);
                    return rec.sensors[i].model.commands.status.returns;
                }
            }
        }

        function getActuatorById(id) {
            for (var i = 0; i < rec.actuators.length; i++) {
                if (rec.actuators[i].id == id) {
                    //console.log(rec.sensors[i].model.commands.status.returns);
                    return rec.actuators[i];
                }
            }
        }

        function updateFieldList() {
            DS.getDeviceById(rec.threshold.device, 'sensor').then(function (data) {
                console.log(data);
                rec.selectedSensor = data;
                $scope.$apply();
            }).catch(function (e) {
                console.error(e);
            });
        }

        function updateEventList() {
            DS.getDeviceById(rec.event.device, 'actuator').then(function (data) {
                console.log(data);
                rec.selectedActuator = data;
                $scope.$apply();
            }).catch(function (e) {
                console.error(e);
            });
        }

        function reset() {

            rec.event = {
                id: null,
                device: null,
                event: null
            };

            rec.threshold = {
                id: null,
                name: null,
                device: null,
                field: null,
                operator: null,
                value: null,
                gate: 'AND'
            };

            rec.timer = {
                id: null,
                name: null,
                time: null
            };
        }

        function addToThresholds() {

            function ChangeRuleInGroups(changedRule) {
                rec.currentGroups.forEach(function(group){
                    var groupIndex = rec.currentGroups.indexOf(group);
                    group.forEach(function(rule){
                        var ruleIndex = group.indexOf(rule);
                        if(rule.id === changedRule.id) {
                            rec.currentGroups[groupIndex][ruleIndex] = changedRule;
                        }
                    });
                });
            }

            function ChangeRuleInType(changedRule) {
                var type = changedRule.type;
                rec.scenario.rules[rec.selectedCommand][type].forEach(function(rule){
                    var index = rec.scenario.rules[rec.selectedCommand][type].indexOf(rule);
                    if(rule.id === changedRule.id) {
                        rec.scenario.rules[rec.selectedCommand][type][index] = changedRule;
                    }
                })
            }

            if (rec.threshold.name !== null && rec.threshold.device !== null) {
                if(!rec.threshold.id) {
                    rec.threshold.id = guid();
                    rec.threshold.type = "thresholds";
                    rec.scenario.rules[rec.selectedCommand].thresholds.push(rec.threshold);
                    rec.currentGroups.push([
                        rec.threshold
                    ]);
                } else {
                    ChangeRuleInGroups(rec.threshold);
                    ChangeRuleInType(rec.threshold);
                }
            }

            if (rec.event.device !== null) {
                if(!rec.event.id) {
                    rec.event.id = guid();
                    rec.event.type = "events";
                    rec.scenario.rules[rec.selectedCommand].events.push(rec.event);
                    rec.currentGroups.push([
                        rec.event
                    ]);
                } else {
                    ChangeRuleInGroups(rec.event);
                    ChangeRuleInType(rec.event);
                }
            }

            if (rec.timer.name !== null) {
                if(!rec.timer.id) {
                    rec.timer.id = guid();
                    rec.timer.type = "timers";
                    rec.scenario.rules[rec.selectedCommand].timers.push(rec.timer);
                    rec.currentGroups.push([
                        rec.timer
                    ]);
                } else {
                    ChangeRuleInGroups(rec.timer);
                    ChangeRuleInType(rec.timer);
                }
            }

            reset();
            $timeout(draggable, 500);
        }

        $timeout(function () {
            $('#timepicker').timepicker({'step': 15, timeFormat: 'H:i'});
            rec.actuators = JSON.parse(JSON.stringify(DS.getActuators()));
            rec.sensors = JSON.parse(JSON.stringify(DS.getSensors()));
            rec.ruleObjects = rec.scenario.rules;
            //$scope.$watch('rec.scenario.rules', function (newVal, oldVal) {
            //    ScenarioService.update(rec.scenario.id, rec.scenario)
            //        .then(function (data) {
            //            return data;
            //        })
            //        .catch(function (err) {
            //            console.error(err);
            //        });
            //}, true);
        });


        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
    }

})();