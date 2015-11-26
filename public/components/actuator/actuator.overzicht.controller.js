(function() {
    'use strict';

    angular
        .module('jarvis.actuator')
        .controller('ActuatorOverzichtCtrl', ActuatorOverzichtCtrl);

    ActuatorOverzichtCtrl.$inject = ["DevicesService", "$state"];

    function ActuatorOverzichtCtrl(DS, $state) {
        var aoc = this;
        aoc.actuator = DS.getActuators();
        aoc.GoToDetail = GoToDetail;

        function GoToDetail(actuator) {
            $state.go("actuatorDetail");
            $state.transitionTo("actuatorDetail", {
                uid: actuator.id,
                data: actuator
            });
        }
    }

})();