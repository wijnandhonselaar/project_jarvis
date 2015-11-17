(function() {
    'use strict';

    angular
        .module('jarvis.devices')
        .controller('DevicesCtrl', DevicesCtrl);

    DevicesCtrl.$inject = ['DevicesService'];

    function DevicesCtrl(DS) {
        var dc = this;
        dc.devices = DS.devices;
        DS.getDevices();
    }

})();