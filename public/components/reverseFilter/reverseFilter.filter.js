(function () {
    'use strict';

    angular
        .module('jarvis.reverseFilter')
        .filter('reverse', reverseFilter);

    reverseFilter.$inject = [];

    function reverseFilter() {
        return function(items) {
            return items.slice().reverse();
        };
    }

})();