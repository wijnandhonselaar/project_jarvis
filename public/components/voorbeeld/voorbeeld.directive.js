(function () {
    'use strict';

    angular
        .module('jarvis.voorbeeld')
        .directive('voorbeeldDirective', voorbeeldDirective);

    function voorbeeldDirective() {
        return {
            templateUrl: 'c',
            restrict: 'E',
            link: function (scope, ele, attr) {
                // dingen
            }
        };

    }

})();