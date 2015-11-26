(function() {
    'use strict';

    angular
        .module('jarvis.log')
        .controller('LogCtrl', LogCtrl);

    LogCtrl.$inject = [];

    function LogCtrl() {
        var lc = this;
    }

})();