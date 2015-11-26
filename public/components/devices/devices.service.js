(function () {
    'use strict';

    angular
        .module('jarvis.devices')
        .factory('DevicesService', DevicesService);

    DevicesService.$inject = ['$http', '$rootScope'];

    function DevicesService($http, $rs) {
        var devices = {
            actuator: [],
            sensor: []
        };
        var onDeviceLoad = [];

        // socket moet nog in een aparte service
        var socket = io.connect('http://localhost:3221');
        socket.on('deviceAdded', function (data) {
            devices[data.data.type].push(data.data);
            $rs.$apply();
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
            sendCommand: sendCommand
        };

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

        function getSensors() {
            return devices.sensor;
        }

        function getActuators() {
            return devices.actuator;
        }

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

        function sendCommand(id, command) {
            return new promise(
                function (resolve, reject) {
                    if (command.httpMethod === "POST") {
                        $http.post('http://localhost:3221/actuator/' + id + '/' + command.name, command.parameters)
                            .success(function (data) {
                                console.log("succesfull send");
                                resolve(data);
                            })
                            .error(function () {
                                console.log("error with command");
                                reject(new Error("Command failed "));
                            });
                    } else if (command.httpMethod === "GET") {
                        $http.get('http://localhost:3221/actuator/' + id + '/' + command.name)
                            .success(function (data) {
                                console.log("succesfull send");
                                resolve(data);
                            })
                            .error(function () {
                                console.log("error with command");
                                reject(new Error("Command failed "));
                            });
                    }
                }
            );
        }

    }
})();