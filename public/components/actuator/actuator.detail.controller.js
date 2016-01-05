(function () {
    'use strict';

    angular
        .module('jarvis.actuator')
        .controller('ActuatorDetailCtrl', ActuatorDetailCtrl);

    ActuatorDetailCtrl.$inject = ["DevicesService", "$stateParams", "$scope", '$timeout', '$state'];

    function ActuatorDetailCtrl(DS, $sp, $scope, $timeout, $state) {
        var adc = this;
        adc.showCommand = showCommand;
        adc.sendcommand = sendcommand;
        adc.HandleCommand = HandleCommand;

        adc.actuatoralias = "";
        adc.updateAlias = updateActuator;

        adc.currentcommand = null;
        adc.currentvalues = {};
        adc.checkInputType = checkInputType;

        adc.GoToDetail = GoToDetail;
        adc.toggleState = toggleState;

        DS.getDeviceById($sp.uid, "actuator")
            .then(function (data) {
                adc.actuator = data;
                adc.actuatoralias = data.config.alias;
                $scope.$apply();
            })
            .catch(function (err) {
                Materialize.toast("Device not found", 4000);
                console.error(err);
            });

        DS.setOnDeviceUpdate(function(data){
            if(data.id === adc.actuator.id) {
                adc.actuator = data;
            }
        });

        $timeout(function () {
            $('.tooltipped').tooltip({delay: 50});
        });

        function GoToDetail(actuator) {
            $state.go("ruleEngine");
            $state.transitionTo("ruleEngine", {
                uid: actuator.id,
                data: actuator
            });
        }


        /**
         * Update actuator object
         * @param key
         * @param value
         * @returns {*}
         */
        function updateActuator(key,value) {
            if(!key || !value) return console.error("no key or value");
            DS.updateDevice("actuators",adc.actuator.id,key,value)
                .then(function(){
                    Materialize.toast("Successfully updated actuator data", 4000);
                })
                .catch(function(err){
                    console.error(err);
                    Materialize.toast("Error updating actuator data",4000);
                });
        }

        /**
         * opens modal if command takes parameter values
         * @param id
         * @param command
         * @param commandkey
         * @param type
         */
        function showCommand(id, command, commandkey, type) {
            adc.commandkey = commandkey;
            var paramKeys = Object.keys(command.parameters);
            if (paramKeys.length > 0) {
                paramKeys.forEach(function(param){
                    if(adc.actuator.status && adc.actuator.status.hasOwnProperty(param)) {
                        adc.currentvalues[param] = adc.actuator.status[param];
                    }
                });
                adc.currentcommand = command;
                $('#commandModal').openModal();
            } else {
                sendcommand(id, command, commandkey, type);
            }
        }

        /**
         * checks input type of parameter
         * @param accept
         * @param inputtype
         * @returns {boolean|*}
         */
        function checkInputType(accept, inputtype) {
            return ( inputtype === "slider" && accept.type === "number" && accept.limit ) ||
                ( inputtype === "input" && ( (accept.type === "number" && !accept.limit ) || (accept.type === "string") ) ) ||
                ( inputtype === "checkbox" && accept.type === "boolean" );
        }

        /**
         * Execute command
         * @param id
         * @param command command.name
         * @param commandkey (key of command object)
         * @param type
         * @param values
         */
        function sendcommand(id, command, commandkey, type, values) {
            DS.sendCommand(id, command, commandkey, type, values)
                .then(function (data) {
                    Materialize.toast("Command successfull excecuted", 4000);
                })
                .catch(function (err) {
                    Materialize.toast("Command error", 4000);
                    console.error(err);
                });
        }

        function HandleCommand() {
            sendcommand(adc.actuator.id, adc.currentcommand, adc.commandkey, 'actuator', adc.currentvalues);
        }

        /**
         * Toggle actuator state (on/off)
         * @param actuator
         */
        function toggleState(actuator){
            if(actuator.status.state === true){
                sendcommand(actuator.id, actuator.model.commands.off,'off',actuator.model.type);
            } else {
                sendcommand(actuator.id, actuator.model.commands.on,'on',actuator.model.type);
            }
        }

    }

})();