(function() {
    'use strict';

    angular
        .module('jarvis.sensor')
        .controller('SensorDetailCtrl', SensorDetailCtrl);

    SensorDetailCtrl.$inject = ["DevicesService", "$stateParams", "$scope"];

    function SensorDetailCtrl(DS, $sp, $scope) {
        var sdc = this;
        sdc.GetValueByKey = GetValueByKey;

        DS.getDeviceById($sp.uid,"sensor")
            .then(function(data){
                sdc.sensor = data;
                $scope.$apply();
            })
            .catch(function(err){
                Materialize.toast("Device not found", 4000);
                console.error(err);
            });

        function GetValueByKey(key) {
            // todo implemented
            return "Not implemented";
        }
    }

})();