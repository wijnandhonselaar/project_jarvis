(function() {
    'use strict';

    angular
        .module('jarvis.actuator')
        .controller('DashboardCtrl', DashboardCtrl);

    DashboardCtrl.$inject = ["DevicesService", "$state", '$scope'];

    function DashboardCtrl(DS, $state, $scope) {
        var db = this;
        // Nothing here
    }

})();