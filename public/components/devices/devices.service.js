(function () {
    'use strict';

    angular
        .module('jarvis.devices')
        .factory('DevicesService', DevicesService);

    DevicesService.$inject = ['$http', '$rootScope', 'socketService'];

    function DevicesService($http, $rs, socket) {
        var devices = {
            actuator: [],
            sensor: []
        };
        var onDeviceLoad = [];
        var onDeviceAdd = null;
        var onDeviceUpdate = null;

        socket.socketListener("deviceAdded", function(data){
            devices[data.model.type].push(data);
            $rs.$apply();
            if(onDeviceAdd){
                onDeviceAdd(data);
            }
        });

        socket.socketListener('deviceEvent', function(data){
            console.log(data);
            var severityLevels = [1,2,3,4,5];
            var event =  $('#event');
            for(var i = 0; i<severityLevels.length; i++){
                event.removeClass('severity'+severityLevels[i]);
            }
            event.addClass('severity'+data.event.severity);
            $('#eventImage').attr('src', data.device.model.image);
            $('#eventMessage').text(data.event.msg);
            event.fadeIn(800);
        });

        $('#event').click(function(){
           $(this).fadeOut(800);
        });


        socket.socketListener('deviceUpdated', function(data){
            for(var i = 0; i<devices[data.model.type].length; i++){
                if(devices[data.model.type][i].id === data.id){
                    devices[data.model.type][i] = data;
                }
            }
            $rs.$apply();
        });


        socket.socketListener("deviceUpdated", function(data){
            devices[data.model.type].forEach(function(device){
                if(device.id == data.id) {
                    var index = devices[data.model.type].indexOf(device);
                    devices[data.model.type][index] = data;
                }
            });
            $rs.$apply();
            if(onDeviceUpdate) {
                onDeviceUpdate(data);
            }
        });

        loadDevices()
            .then(function () {
                if (onDeviceLoad.length === 0) return false;
                onDeviceLoad.forEach(function (f) {
                    f();
                });
            });

        return {
            loadDevices: loadDevices,
            getSensors: getSensors,
            getActuators: getActuators,
            getDeviceById: getDeviceById,
            sendCommand: sendCommand,
            addDeviceLoader: addDeviceLoader,
            setOnDeviceAdd: setOnDeviceAdd,
            setOnDeviceUpdate: setOnDeviceUpdate,
            updateDevice: updateDevice
        };

        function getDeviceById(uid, type) {
            return new Promise(
                function (resolve, reject) {
                    if (devices[type].length === 0) {
                        onDeviceLoad.push(function () {
                            if (devices[type].length === 0) {
                                reject(new Error("No devices found"));
                            } else {
                                getDeviceById(uid, type)
                                    .then(function (data) {
                                        resolve(data);
                                    });
                            }
                        });
                    } else {
                        var found = false;
                        devices[type].forEach(function (device) {
                            if (device.id == uid) {
                                found = true;
                                resolve(device);
                            }
                        });
                        if (!found) {
                            reject(new Error("Device with uid " + uid + " not found."));
                        }
                    }
                }
            );
        }

        function getSensors() {
            return devices.sensor;
        }

        function getActuators() {
            return devices.actuator;
        }

        function setOnDeviceAdd(f) {
            onDeviceAdd = f;
        }

        function setOnDeviceUpdate(f) {
            onDeviceUpdate = f;
        }

        function addDeviceLoader(f) {
            onDeviceLoad.push(f);
        }

        function loadDevices() {
            return new Promise(
                function (resolve, reject) {
                    $http.get("/devices")
                        .success(function (data) {
                            data = data.devices;
                            data.actuators.forEach(function (actuator) {
                                devices.actuator.push(actuator);
                            });
                            data.sensors.forEach(function (sensor) {
                                devices.sensor.push(sensor);
                            });
                            // LOGGING
                            console.log("Got devices data.");
                            resolve();
                        })
                        .error(function (err) {
                            // ERROR
                            console.error("Error loading devices: ", err);
                            reject(err);
                        });
                }
            );
        }

        function sendCommand(id, command, commandkey, type) {
            return new Promise(
                function (resolve, reject) {
                    if (command.httpMethod === "POST") {
                        $http.post('http://localhost:3221/devices/'+type+'/' + id + '/' + commandkey, { })
                            .success(function (data) {
                                console.log("succesfull send");
                                resolve(data);
                            })
                            .error(function (err) {
                                console.error(err);
                                console.error("error with command");
                                reject(new Error("Command failed "));
                            });
                    } else if (command.httpMethod === "GET") {
                        $http.get('http://localhost:3221/devices/'+type+'/' + id + '/' + commandkey)
                            .success(function (data) {
                                console.log("succesfull send");
                                resolve(data);
                            })
                            .error(function () {
                                console.error("error with command");
                                reject(new Error("Command failed "));
                            });
                    }
                }
            );
        }

        function updateDevice(type, uid, field, value) {
            return new Promise(
                function(resolve, reject) {
                    var data = {};
                    data[field] = value;
                    $http.put("/devices/" + type + "/" + uid + "/" + field, data)
                        .success(function(data){
                            if(data.err) return reject(new Error(data.err));
                            resolve();
                        })
                        .error(function(err) {
                            console.error(err);
                            reject(err);
                        });
                }
            );
        }

    }
})();