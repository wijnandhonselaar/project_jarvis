(function () {
    'use strict';

    angular
        .module('jarvis.actuator')
        .controller('ActuatorDetailCtrl', ActuatorDetailCtrl);

    ActuatorDetailCtrl.$inject = ["DevicesService", "$stateParams", "$scope", '$timeout', '$http', '$compile'];

    function ActuatorDetailCtrl(DS, $sp, $scope, $timeout, $http, $compile) {
        var adc = this;
        adc.showCommand = showCommand;
        adc.sendcommand = sendcommand;

        //adc.optionSettingsList = [];
        adc.sliderSettings = [];

        DS.getDeviceById($sp.uid, "actuator")
            .then(function (data) {
                adc.actuator = data;
                $scope.$apply();
            })
            .catch(function (err) {
                Materialize.toast("Device not found", 4000);
                console.error(err);
            });

        function buildPartial(partial, callback) {
            $http.get('components/actuator/partials/' + partial + '.html').success(function (data) {
                callback($(data));
            });
        }

        function showCommand(id, command, commandkey, type) {
            if (Object.keys(command.parameters).length > 0) {
                $('#commandTitle').text(command.name);
                generateInputByCommand(command, function (html) {
                    $('.modalWrapper').html($compile(html)($scope));
                });
                $('#commandModal').openModal();
            } else {
                sendcommand(id, command, commandkey, type);
            }
        }

        function sliderListener(id){
            console.log(id);
        }

        function generateInputByCommand(command, callback) {

            for (var param in command.parameters) {
                if (command.parameters.hasOwnProperty(param)) {
                    var paramObj = command.parameters[param];
                    console.log(paramObj);
                    for (var i = 0; i <= paramObj.accepts.length - 1; i++) {
                        var accepts = paramObj.accepts[i];
                        switch (accepts.type) {
                            case 'number':
                                for (var b = 0; b <= accepts.limit.length - 1; b++) {
                                    var limit = accepts.limit[b];
                                    switch (limit.type) {
                                        case 'number':

                                            var conf = {
                                                model:limit.max,
                                                onChange:sliderListener,
                                                options: {
                                                    id:param,
                                                    floor: limit.min,
                                                    ceil: limit.max
                                                }
                                            };

                                            var add = true;
                                            for(var c = 0; c<=adc.sliderSettings.length-1; c++) {
                                                if(adc.sliderSettings[c].options.id === param){
                                                    add = false;
                                                }
                                            }
                                            if(add) adc.sliderSettings.push(conf);
                                            buildPartial('slider', callback);
                                            break;
                                    }
                                }
                                break;
                            case 'string':
                                break;
                            case 'boolean':
                                break;
                        }
                    }
                }
            }
        }

        $timeout(function () {
            $('.tooltipped').tooltip({delay: 50});
        });

        function sendcommand(id, command, commandkey, type) {
            DS.sendCommand(id, command, commandkey, type)
                .then(function (data) {
                    Materialize.toast("Command successfull excecuted", 4000);
                    console.log(data);
                })
                .catch(function (err) {
                    Materialize.toast("Command error", 4000);
                    console.log(err);
                });
        }

    }

})();