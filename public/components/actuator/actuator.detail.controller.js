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

        function showCommand(command){
            if(Object.keys(command.parameters).length > 0) {
                $('#commandTitle').text(command.name);
                $('#commandModal').openModal();
            }
        }

        $timeout(function(){
            $('.tooltipped').tooltip({delay: 50});
        });
        
        //$scope.sendcommand = function(command, type){
        //    DS.sendCommand($sp.uid, command, type)
        //        .then(function(data){
        //            Materialize.toast("Command successfull excecuted", 4000);
        //            console.log(data);
        //        })
        //        .catch(function(err){
        //            Materialize.toast("Command error", 4000);
        //            console.log(err);
        //        });
        //};

    }

})();