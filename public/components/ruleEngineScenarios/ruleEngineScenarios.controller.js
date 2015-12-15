(function () {
    //'use strict';
    angular
        .module('jarvis.ruleEngineScenarios')
        .controller('ruleEngineScenariosCtrl', ruleEngineScenariosCtrl);

    ruleEngineScenariosCtrl.$inject = ["DevicesService", "$stateParams", "$scope", '$timeout', '$http', 'ScenarioService'];

    function ruleEngineScenariosCtrl(DS, $sp, $scope, $timeout, $http, ScenarioService) {
        var rec = this;
        rec.scenario = $sp.data;
        rec.sensors = [];
        rec.actuators = [];
        rec.openModal = openModal;
        rec.showDetailTimer = showDetailTimer;
        rec.getActuatorById = getActuatorById;
        rec.showDetail = showDetail;
        rec.getSensorById = getSensorById;
        rec.selectedSensor = null;
        rec.selectedActuator = null;
        rec.selectedCommand = null;
        rec.closeModal = closeModal;
        rec.showDetailEvent = showDetailEvent;
        rec.updateFieldList = updateFieldList;
        rec.addToThresholds = addToThresholds;
        rec.getSensorFields = getSensorFields;
        rec.updateEventList = updateEventList;
        rec.translateOperator = translateOperator;
        rec.remove = remove;

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
            rec.threshold = rule;
            $('#ruleModal').openModal();
        }


        function showDetailEvent(rule) {
            rec.event = rule;
            $('#eventModal').openModal();
        }

        function showDetailTimer(rule) {
            rec.timer = rule;
            $('#timerModal').openModal();
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

            if (rec.threshold.name !== null && rec.threshold.device !== null) {
                rec.threshold.id = guid();
                rec.scenario.rules[rec.selectedCommand].thresholds.push(rec.threshold);
            }

            if (rec.event.device !== null) {
                console.log('ik sla een event op');
                if (!rec.ruleObjects.events) {
                    rec.ruleObjects.events = [];
                }
                rec.event.id = guid();
                rec.scenario.rules[rec.selectedCommand].events.push(rec.event);
            }

            if (rec.timer.name !== null) {
                if (!rec.ruleObjects.timers) {
                    rec.ruleObjects.timers = [];
                }
                rec.timer.id = guid();
                rec.scenario.rules[rec.selectedCommand].timers.push(rec.timer);
            }

            reset();
        }

        $timeout(function () {
            $('#timepicker').timepicker({'step': 15, timeFormat: 'H:i'});
            rec.actuators = JSON.parse(JSON.stringify(DS.getActuators()));
            rec.sensors = JSON.parse(JSON.stringify(DS.getSensors()));
            rec.ruleObjects = rec.scenario.rules;
            $scope.$watch('rec.scenario.rules', function (newVal, oldVal) {
                ScenarioService.update(rec.scenario.id, rec.scenario)
                    .then(function (data) {
                        return data;
                    })
                    .catch(function (err) {
                        console.error(err);
                    });
            }, true);
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