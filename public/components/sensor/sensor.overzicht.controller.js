(function() {
    'use strict';

    angular
        .module('jarvis.sensor')
        .controller('SensorOverzichtCtrl', SensorOverzichtCtrl);

    SensorOverzichtCtrl.$inject = ["DevicesService", "$state", '$scope', '$compile', '$timeout', '$sce'];

    function SensorOverzichtCtrl(DS, $state, $scope, $compile, $timeout, $sce) {
        var soc = this;
        var swiper = null;
        soc.sensors = DS.getSensors();
        soc.GoToDetail = GoToDetail;
        soc.repeater = [];

        DS.addDeviceLoader(reloadSwiper);
        DS.setOnDeviceAdd(reloadSwiper);

        function reloadSwiper() {
            var amount = Math.ceil( soc.sensors.length / 8 );
            soc.repeater = [];
            for(var i = 0; i < amount; i++) {
                soc.repeater.push(i);
            }
            $scope.$apply();
            swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true
            });
        }
        $timeout(reloadSwiper);

        function GoToDetail(sensor) {
            $state.go("sensorDetail");
            $state.transitionTo("sensorDetail", {
                uid: sensor.id,
                data: sensor
            });
        }
    }

})();