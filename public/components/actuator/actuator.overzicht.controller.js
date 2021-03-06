(function () {
    'use strict';

    angular
        .module('jarvis.actuator')
        .controller('ActuatorOverzichtCtrl', ActuatorOverzichtCtrl);

    ActuatorOverzichtCtrl.$inject = ["DevicesService", "$state", '$scope', '$compile', '$timeout', '$sce'];

    function ActuatorOverzichtCtrl(DS, $state, $scope, $compile, $timeout, $sce) {
        var aoc = this;
        var swiper = null;
        aoc.actuator = DS.getActuators();
        aoc.GoToDetail = GoToDetail;
        aoc.toggleState = toggleState;
        aoc.checkIfDeviceHas = checkIfDeviceHas;
        aoc.repeater = [];

        DS.addDeviceLoader(reloadSwiper);
        DS.setOnDeviceAdd(reloadSwiper);

        /**
         * Check if device has rules
         * @param type
         * @param actuator
         * @returns {boolean}
         */
        function checkIfDeviceHas(type, actuator){
            for (var property in actuator.config.rules) {
                if (actuator.config.rules.hasOwnProperty(property)) {
                    if( actuator.config.rules[property][type].length > 0){
                        return true;
                    }
                }
            }
            return false;
        }

        /**
         * Toggle state of actuator (by clicking on the shortcut icon)
         * @param actuator
         */
        function toggleState(actuator){
            if(actuator.status.state === true){
                sendcommand(actuator.id, actuator.model.commands.off,'off',actuator.model.type);
            } else {
                sendcommand(actuator.id, actuator.model.commands.on,'on',actuator.model.type);
            }
        }


        /**
         * Reload swiper plugin (generates new slide tabs on the screen)
         */
        function reloadSwiper() {
            var amount = Math.ceil( aoc.actuator.length / 8 );
            aoc.repeater = [];
            for(var i = 0; i < amount; i++) {
                aoc.repeater.push(i);
            }
            $scope.$apply();
            swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true
            });
        }
        $timeout(reloadSwiper);

        function GoToDetail(actuator) {
            $state.go("actuatorDetail");
            $state.transitionTo("actuatorDetail", {
                uid: actuator.id,
                data: actuator
            });
        }

        /**
         * Execute command
         * @param id
         * @param command
         * @param commandkey
         * @param type
         */
        function sendcommand(id, command, commandkey, type) {
            DS.sendCommand(id, command, commandkey, type)
                .then(function (data) {
                    Materialize.toast("Command successfull excecuted", 4000);
                })
                .catch(function (err) {
                    Materialize.toast("Command error", 4000);
                    console.error(err);
                });
        }

    }

})();