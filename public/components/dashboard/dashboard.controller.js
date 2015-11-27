(function() {
    'use strict';

    angular
        .module('jarvis.actuator')
        .controller('DashboardCtrl', DashboardCtrl);

    DashboardCtrl.$inject = ["DevicesService", "$state"];

    function DashboardCtrl(DS, $state) {
        var db = this;
    }

})();