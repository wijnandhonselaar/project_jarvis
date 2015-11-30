(function() {
    'use strict';

    angular
        .module('jarvis.sensor')
        .controller('SensorOverzichtCtrl', SensorOverzichtCtrl);

    SensorOverzichtCtrl.$inject = ["DevicesService", "$state", '$scope', '$compile', '$timeout', '$sce'];

    function SensorOverzichtCtrl(DS, $state, $scope, $compile, $timeout, $sce) {
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

        function generateSlides(cb) {
            var maxNumberOfEntriesOnSlide = 4;
            var numberOfEntries = soc.sensors.length;
            $.get("components/sensor/sensor.overzicht.slide.html", function (data) {
                for (var currentPos = 0; currentPos < numberOfEntries; currentPos += maxNumberOfEntriesOnSlide) {
                    var html = $(data);
                    $('.repeater', $(html)).attr("ng-if", "($index >= " + currentPos + " && $index <= " + maxNumberOfEntriesOnSlide+currentPos+')');
                    $('.swiper-wrapper').append($compile(html)($scope));
                }
                if (cb) cb();
            });
        }

        $timeout(function () {
            generateSlides(function () {
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true
                });
            });
        });

    }

})();