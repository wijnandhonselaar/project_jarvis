(function () {
    'use strict';

    angular
        .module('jarvis.devices')
        .factory('DevicesService', DevicesService);

    DevicesService.$inject = ['$http', '$rootScope', 'socketService', "$timeout"];

    function DevicesService($http, $rs, socket, $timeout) {
        var devices = {
            actuator: [],
            sensor: []
        };
        var onDeviceLoad = [];
        var onDeviceAdd = null;
        var onDeviceUpdate = null;

        socket.socketListener("deviceAdded", function (data) {
            devices[data.model.type].push(data);
            $rs.$apply();
            if (onDeviceAdd) {
                onDeviceAdd(data);
            }
        });

        socket.socketListener("deviceUpdated", function (data) {
            devices[data.model.type].forEach(function (device) {
                if (device.id == data.id) {
                    var index = devices[data.model.type].indexOf(device);
                    devices[data.model.type][index] = data;
                }
            });
            $rs.$apply();
            if (onDeviceUpdate) {
                onDeviceUpdate(data);
            }
        });


        var currentlyResolving = {status:false, device:null};
        var resolve2 = $('#resolve2');
        var resolve1 = $('#resolve1');
        socket.socketListener("resolveConflict", function (data) {
            var conflictPopUp = $('#conflictmodal');
            if(!currentlyResolving.status) {
                conflictPopUp.openModal();
                resolve1.html('Scenario: ' + data.executed.scenario + '<br>'+data.executed.device.config.alias + ': '+data.executed.command);
                resolve1.data('scenario', data.executed.scenario);
                resolve2.html('Scenario: ' + data.conflicting.scenario + '<br>'+data.conflicting.device.config.alias + ': '+data.conflicting.command);
                resolve2.data('scenario', data.conflicting.scenario);
                currentlyResolving.status = true;
                currentlyResolving.device = data.executed.device;
            }
        });

        resolve1.click(function(){
            resolveConflict($(this).data('scenario'), resolve2.data('scenario'));
        });

        resolve2.click(function(){
            resolveConflict($(this).data('scenario'), resolve1.data('scenario'));
        });

        function resolveConflict(winningScenario, losingScenario) {

            var object = {
                winner: winningScenario,
                loser: losingScenario,
                device: currentlyResolving.device
            };

            $http.post('http://localhost:3221/devices/'+object.device.model.type+'/' + object.device.id + '/resolveconflict', object).
                success(function (data) {
                    console.log('CONFLICT', 'resolved');
                    $('#conflictmodal').closeModal();
                })
                .error(function (err){
                    console.log('CONFLICT', 'error while resolving');
                    $('#conflictmodal').closeModal();
                });
        }




        function updateRules(id, obj) {
            $http.post('http://localhost:3221/devices/actuators/' + id + '/rules', {rules: obj})
                .success(function (data) {
                    console.log("succesfully saved");
                })
                .error(function (err) {
                    console.error(err);
                    console.error("error with command");
                });
        }

        // Buildevent en de socketlistener moeten naar logservice
        function buildEvent(severity, imgsrc, msg) {
            if (severity == 1) {
                var eventEl = document.createElement("div");
                eventEl.className = "event severity" + severity;

                var eventImg = document.createElement("img");
                eventImg.className = "invert";
                eventImg.src = imgsrc;
                eventImg.style.width = "160px";
                eventImg.style.marginTop = "-25px";
                eventImg.style.zIndex = 99999999999;
                eventEl.appendChild(eventImg);

                var eventBr = document.createElement("br");
                eventEl.appendChild(eventBr);

                var eventMsg = document.createElement("span");
                eventMsg.style.fontSize = "45px";
                eventMsg.innerHTML = msg;
                eventEl.appendChild(eventMsg);

                document.body.appendChild(eventEl);

                var $eventEl = $(eventEl);
                $eventEl.fadeIn(800);


                eventEl.addEventListener("click", remove);
            }

            function remove() {
                $eventEl.fadeOut(800);
                $timeout(function () {
                    eventEl.parentNode.removeChild(eventEl);
                }, 800);
            }
        }

        socket.socketListener('deviceEvent', function (data) {
            buildEvent(data.event.severity, data.device.model.image, data.event.msg);
        });
        // Tot hierzo.

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
            updateDevice: updateDevice,
            updateRules: updateRules
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

        function sendCommand(id, command, commandkey, type, values) {
            return new Promise(
                function (resolve, reject) {
                    if (command.httpMethod === "POST") {
                        $http.post('http://localhost:3221/devices/' + type + '/' + id + '/commands/' + commandkey, {})

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
                        $http.get('http://localhost:3221/devices/' + type + '/' + id + '/commands/' + commandkey)
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
                function (resolve, reject) {
                    var data = {};
                    data[field] = value;
                    $http.put("/devices/" + type + "/" + uid + "/" + field, data)
                        .success(function (data) {
                            if (data.err) return reject(new Error(data.err));
                            resolve();
                        })
                        .error(function (err) {
                            console.error(err);
                            reject(err);
                        });
                }
            );
        }

    }
})();