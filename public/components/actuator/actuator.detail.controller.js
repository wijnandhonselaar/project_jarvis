(function() {
    'use strict';

    angular
        .module('jarvis.actuator')
        .controller('ActuatorDetailCtrl', ActuatorDetailCtrl);

    ActuatorDetailCtrl.$inject = ["DevicesService", "$stateParams", "$scope", '$timeout'];

    function ActuatorDetailCtrl(DS, $sp, $scope, $timeout) {
        var adc = this;
        adc.showCommand = showCommand;

        DS.getDeviceById($sp.uid,"actuator")
            .then(function(data){
                adc.actuator = data;
                $scope.$apply();
            })
            .catch(function(err){
                Materialize.toast("Device not found", 4000);
                console.error(err);
            });

        function showCommand(paramList){
            if(paramList.length>0)
            $('#commandModal').openModal();
        }


        $timeout(function(){
            $('.tooltipped').tooltip({delay: 50});
        });
    }

})();