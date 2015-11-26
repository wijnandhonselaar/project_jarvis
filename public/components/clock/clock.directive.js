(function () {
    'use strict';

    angular
        .module('jarvis.clock')
        .directive('clock', clockDir);

    clockDir.$inject = ['dateFilter', '$timeout'];

    function clockDir(dateFilter, $timeout) {
        return {
            restrict: 'E',
            scope: {
                format: '@'
            },
            link: function (scope, element, attrs) {
                var updateTime = function () {
                    var now = Date.now();

                    element.html(dateFilter(now, scope.format));
                    $timeout(updateTime, now % 1000);
                };

                updateTime();
            }

        };
    }

})();