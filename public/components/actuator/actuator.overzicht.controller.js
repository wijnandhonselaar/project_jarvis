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
        aoc.slides = null;
        aoc.toTrusted = toTrusted;

        function toTrusted(html_code) {
            return $sce.trustAsHtml(html_code);
        }

        function GoToDetail(actuator) {
            $state.go("actuatorDetail");
            $state.transitionTo("actuatorDetail", {
                uid: actuator.id,
                data: actuator
            });
        }

        function generateSlides(cb) {
            var maxNumberOfEntriesOnSlide = 4;
            var numberOfEntries = aoc.actuator.length;
            $.get("components/actuator/actuator.overzicht.slide.html", function (data) {
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
                swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true
                });
            });
        });
    }

})();