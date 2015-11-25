(function() {
    'use strict';

    angular
        .module('jarvis.sensor')
        .controller('SensorOverzichtCtrl', SensorOverzichtCtrl);

    SensorOverzichtCtrl.$inject = ["DevicesService", "$state"];

    function SensorOverzichtCtrl(DS, $state) {
        var soc = this;
        soc.sensors = DS.getSensors();
        soc.GoToDetail = GoToDetail;

        function GoToDetail(sensor) {
            $state.go("sensorDetail");
            $state.transitionTo("sensorDetail", {
                uid: sensor.id,
                data: sensor
            });
        }
    }

})();