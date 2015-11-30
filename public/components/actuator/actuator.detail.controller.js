(function() {
    'use strict';

    angular
        .module('jarvis.actuator')
        .controller('ActuatorDetailCtrl', ActuatorDetailCtrl);

    ActuatorDetailCtrl.$inject = ["DevicesService", "$stateParams", "$scope", '$timeout'];

    function ActuatorDetailCtrl(DS, $sp, $scope, $timeout) {
        var adc = this;
        adc.showCommand = showCommand;
        adc.sendcommand = sendcommand;

        DS.getDeviceById($sp.uid,"actuator")
            .then(function(data){
                adc.actuator = data;
                $scope.$apply();
            })
            .catch(function(err){
                Materialize.toast("Device not found", 4000);
                console.error(err);
            });

        function generateInputByCommand(command){

        }

        function showCommand(id, command, commandkey, type){
            if(Object.keys(command.parameters).length > 0) {
                $('#commandTitle').text(command.name);
                $('.modalWrapper').html(generateInputByCommand(command));
                $('#commandModal').openModal();
            } else {
                sendcommand(id, command, commandkey, type);
            }
        }

        $timeout(function(){
            $('.tooltipped').tooltip({delay: 50});
        });
        
        function sendcommand(id, command, commandkey, type){
            DS.sendCommand(id, command, commandkey, type)
                .then(function(data){
                    Materialize.toast("Command successfull excecuted", 4000);
                    console.log(data);
                })
                .catch(function(err){
                    Materialize.toast("Command error", 4000);
                    console.log(err);
                });
        }

    }

})();