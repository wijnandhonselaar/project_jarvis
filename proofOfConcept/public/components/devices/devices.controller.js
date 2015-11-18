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

        var socket = io.connect('/');
        socket.on('event', function (data) {
            console.log(data);
            if(data.event == "deviceschanged") {
                DS.getDevices();
            }
        });
    }

})();