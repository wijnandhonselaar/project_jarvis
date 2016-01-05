(function () {
    'use strict';

    angular
        .module('jarvis.scenario')
        .controller('ScenarioDetailctrl', ScenarioDetailctrl);

    ScenarioDetailctrl.$inject = ["ScenarioService", "$stateParams","$state", "$scope", "$timeout", "socketService", '$http'];

    function ScenarioDetailctrl(ScenarioService, $sp, $state, $scope, $timeout, socketService, $http) {
        var sdc = this;
        sdc.uid = $sp.uid;
        sdc.updatename = updateName;
        sdc.addActuator = addActuator;
        sdc.select = select;
        sdc.updateDescription = updateDescription;
        sdc.delete = deleteScenario;
        sdc.removeActuator = removeActuator;
        sdc.updateActuator = updateActuator;
        sdc.selectedAction = selectedAction;
        sdc.isAllowedCommand = ScenarioService.isAllowedCommand;
        sdc.devices = [];
        sdc.repeater = [];
        sdc.actuators = [];
        sdc.GoToDetail = GoToDetail;
        sdc.preemtiveConflictDetection = {};
        sdc.setConflictingScenarioDevicePriority = setConflictingScenarioDevicePriority;
        sdc.resolvedConflicts = [];
        sdc.setClass = setClass;
        sdc.showConflictList = showConflictList;
        var swiper = null;
        var modalIsOpen = false;

        sdc.log = function(log){
            console.log("log:\n", log);
        };

        $('.modal-trigger').leanModal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            ready: function() { modalIsOpen = true; }, // Callback for Modal open
            complete: function() { modalIsOpen = false; } // Callback for Modal close
        });

        function showConflictListModal(){
            $( ".modal-trigger" ).trigger( "click" );
        }


        socketService.socketListener('preemtiveConflictDetection', function(data){
            sdc.preemtiveConflictDetection = data;
            $scope.$apply();
            if(!modalIsOpen) {
                modalIsOpen = true;
                showConflictListModal();
            }
            //$('#conflictOverviewModal').openModal();
        });

        socketService.socketListener('resolvedConflictsList', function(data){
            sdc.resolvedConflicts = data;
            $scope.$apply();
            console.log(data);
        });

        function showConflictList(){
            $http.post('http://localhost:3221/scenario/'+ sdc.uid +'/tickle', sdc.scenario).success(function(data){

            }).error(function(err){

            });
        }

        function setClass(scenario, device, toggle){
            for(var i = 0; i<sdc.resolvedConflicts.length; i++){
                if(sdc.resolvedConflicts[i].winner == scenario && sdc.resolvedConflicts[i].device.id == device && toggle == 'yes'){
                   return 'yesActive';
                } else if(sdc.resolvedConflicts[i].loser == scenario && sdc.resolvedConflicts[i].device.id == device && toggle == 'no') {
                   return 'noActive';
                }
            }
        }

        function setConflictingScenarioDevicePriority(winner, loser, deviceId){
            var object = {
                winner: winner,
                loser: loser,
                device: deviceId
            };

            $http.post('http://localhost:3221/scenario/' + sdc.uid + '/resolveconflict', object).
                success(function (data) {
                    console.log('CONFLICT', 'resolved');
                })
                .error(function (err) {
                    console.log('CONFLICT', 'error while resolving');
                });
        }


        var elisteners = [];
        function addListeners() {
            function changeListenerCreator(device) {
                return function(){
                    sdc.updateActuator(device.id);
                };
            }
            sdc.devices.forEach(function(device){
                if(elisteners.indexOf(device.id) == -1) {
                    var el = document.getElementById("selectChange" + device.id);
                    el.addEventListener("change", changeListenerCreator(device));
                    elisteners.push(device.id);
                }
            });
        }

        $timeout(addListeners, 2000);

        /**
         * Scenario model
         * @type {{name: string, description: string, actuators: *[]}}
         */
        sdc.scenario = {
            name: "",
            description: "",
            actuators: [{
                deviceid: null,
                action: {
                    command: "",
                    parameters: []
                }
            }],
            status:""
        };

        getScenario(sdc.uid);

        function GoToDetail(scenario){
            $state.go("ruleEngineScenarios");
            $state.transitionTo("ruleEngineScenarios", {
                uid: scenario.id,
                data: scenario
            });
        }

        function addActuator(){
            sdc.actuators = [];
            ScenarioService.getActuators()
                .then(function(data){
                    for(var i = 0; i<data.actuators.length; i++){
                        var exists = false;
                        for(var j = 0; j<sdc.scenario.actuators.length; j++){
                            if(data.actuators[i].id === sdc.scenario.actuators[j].deviceid){
                                exists = true;
                            }
                        }
                        if(!exists){
                            sdc.actuators.push(data.actuators[i]);
                        }
                    }
                    $('#actuatorscenario').openModal();
                    reloadSwiper();
                })
                .catch(function(err){
                    console.error(err);
                    return err;
                });
        }

        function reloadSwiper() {
            var amount = Math.ceil( sdc.actuators.length / 6 );
            sdc.repeater = [];
            for(var i = 0; i < amount; i++) {
                sdc.repeater.push(i);
            }
            $scope.$apply();
            swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true
            });
        }

        function removeActuator(id) {
            for(var i = 0; i < sdc.devices.length; i++) {
                if(sdc.devices[i].id === id) {
                    delete sdc.devices[i].config.scenarios[sdc.scenario.name];
                    ScenarioService.removeScenarioFromActuator(sdc.devices[i].id, sdc.scenario.name);
                    sdc.devices.splice(i, 1);
                }
            }
            for(i = 0; i < sdc.scenario.actuators.length; i++) {
                if(sdc.scenario.actuators[i].deviceid === id) {
                    sdc.scenario.actuators.splice(i, 1);
                    ScenarioService.update(sdc.scenario.id, sdc.scenario);
                }
            }
        }

        function select(actuator){
            $('#actuatorscenario').closeModal();
            sdc.devices.push(actuator);
            for(var i = 0; i < sdc.devices.length; i++) {
                if(sdc.devices[i].id === actuator.id) {
                    sdc.devices[i].config.scenarios[sdc.scenario.name] = {
                        command: 'on',
                        parameters: []
                    };
                    ScenarioService.updateActuator(sdc.devices[i]);
                }
            }
            sdc.scenario.actuators.push({
                deviceid: actuator.id,
                action: {
                    command: "on",
                    parameters: []
                },
                priority: 100
            });
            updateScenario();
            $timeout(addListeners);
        }

        function updateScenario(){
            ScenarioService.update(sdc.scenario.id, sdc.scenario)
                .then(function(data){
                   return data;
                })
                .catch(function(err){
                    console.error(err);
                });
        }

        function getScenario(id) {
            ScenarioService.get(id)
                .then(function(data){
                    sdc.scenario = data.scenario;
                    sdc.scenarioName = data.scenario.name;
                    sdc.scenarioDescription = data.scenario.description;
                    sdc.scenario.actuators.forEach(function(actuator) {
                        var act = actuator;
                        ScenarioService.getActuatorByID(actuator.deviceid)
                            .then(function(data) {
                                data.action = {
                                    command: act.action.command
                                };
                                sdc.devices.push(data);
                                $scope.$apply();
                            })
                            .catch(function (err) {
                                console.error(err);
                            });
                    });
                    $timeout(function(){

                    },1000);
                    return data;
                })
                .catch(function (err) {
                    console.error("Error get scenario ", err);
                    return err;
                });
        }

        function updateName(id, scenarioName){
            ScenarioService.updateName(id, sdc.scenario)
                .then(function(data){
                    sdc.scenario.name = scenarioName;
                    return data;
                })
                .catch(function (data) {
                    console.log(data);
                    if(data.err === "name"){
                        Materialize.toast("name already exists", 2000);
                        sdc.scenarioName = "Give me a name";
                    }
                    console.error("Error with update ",data);
                    return data;
                });
        }

        function updateDescription(id, scenarioDescription){
            sdc.scenario.description = scenarioDescription;
            ScenarioService.update(id, sdc.scenario)
                .then(function(data){
                    return data;
                })
                .catch(function (err) {
                    console.error("Error with update description", err);
                    return err;
                });
        }


        function deleteScenario(scenario) {
            for(var i = 0; i < sdc.scenario.actuators.length; i++) {
                sdc.removeActuator(sdc.scenario.actuators[i].deviceid);
            }
            ScenarioService.delete(scenario)
                .then(function (data) {
                    goToOverview();
                    return data;
                })
                .catch(function (err) {
                    goToOverview();
                    console.error(err);
                    return err;
                });
        }

        function updateActuator(id) {
            var action = $('#selectChange'+id + ' option:selected').val();
            for(var i = 0; i < sdc.devices.length; i++) {
                if(sdc.devices[i].id == id) {
                    sdc.devices[i].config.scenarios[sdc.scenario.name].command = action;
                    ScenarioService.updateActuator(sdc.devices[i]);
                }
            }
            for(i = 0; i < sdc.scenario.actuators.length; i++) {
                if(sdc.scenario.actuators[i].deviceid == id) {
                    sdc.scenario.actuators[i].action.command = action;
                    ScenarioService.update(sdc.scenario.id, sdc.scenario);
                }
            }

        }

        function selectedAction(key, actuator) {
            for(var i = 0; i < sdc.scenario.actuators.length; i++) {
                var item = sdc.scenario.actuators[i];
                if(item.deviceid == actuator.id) {
                    if(item.action.command == key) {
                        return true;
                    }
                }
            }
            return false;
        }



        function goToOverview() {
            $state.go("scenarioOverzicht");
        }
    }
})
();