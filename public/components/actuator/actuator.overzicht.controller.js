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
        aoc.repeater = [];

        DS.addDeviceLoader(reloadSwiper);
        DS.setOnDeviceAdd(reloadSwiper);

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

    }

})();