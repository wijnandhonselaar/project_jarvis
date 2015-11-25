(function () {
    'use strict';

    angular
        .module('jarvis.voorbeeld')
        .directive('voorbeeldDirective', voorbeeldDirective);

    voorbeeldDirective.$inject = [];

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