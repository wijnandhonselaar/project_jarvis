(function () {
    'use strict';

    angular
        .module('jarvis.scenario')
        .factory('ScenarioService', ScenarioService);

    ScenarioService.$inject = ['$http', '$rootScope', "$timeout"];

    function ScenarioService($http, $rs, $timeout) {

        function createScenario(name, description, actuators) {
            var actuarorString = JSON.stringify(actuators);
            return new Promise(
                function (resolve, reject) {
                    $http.post("/scenario", {name: name, description: description, actuators: actuarorString})
                        .success(function (data) {
                            if (data.err) return reject(new Error(data.err));
                            resolve(data);
                        })
                        .error(function (err) {
                            console.error(err);
                            reject(err);
                        });
                }
            );
        }



        function getScenario(id) {
            return new Promise(
                function (resolve, reject) {
                    $http.get("/scenario/" + id)
                        .success(function (data) {
                            resolve(data);
                        })
                        .error(function (err) {
                            console.error("Error get scenario's", err);
                            reject(err);
                        });
                });
        }

        function getScenarios() {
            return new Promise(
                function (resolve, reject) {
                    $http.get("/scenario")
                        .success(function (data) {
                            resolve(data);
                        })
                        .error(function (err) {
                            console.error("Error get scenario's", err);
                            reject(err);
                        });
                });
        }


        function toggleState(scenario){
            return new Promise(
                function(resolve,reject){
                    $http.put("/scenario/toggle", {scenario: JSON.stringify(scenario)})
                        .success(function(data){
                            resolve(data);
                        })
                        .error(function(err){
                            console.error(err);
                            reject(err);
                        });
                }
            );
        }

        function update(id, scenario) {
            return new Promise(
                function (resolve, reject) {
                    $http.put("/scenario/" + id, {scenario: JSON.stringify(scenario)})
                        .success(function (data) {
                            resolve(data);
                            Materialize.toast("Succesful changed", 4000);
                        })
                        .error(function (err) {
                            console.error(err);
                            reject(err);
                        });
                }
            );
        }

        function deleteScenario(scenario){
            return new Promise(
                function(resolve, reject){
                  $http.delete("/scenario/"+scenario.id)
                      .success(function(data){
                          resolve(data);
                          Materialize.toast("Deleted Scenario", 4000);
                      })
                      .error(function(err){
                          reject(err);
                          console.error(err);
                      });
                }
            );
        }

        function getActuators() {
            return new Promise(
                function (resolve, reject) {
                    $http.get('/devices/actuators')
                        .success(function (data) {
                            resolve(data);
                        })
                        .error(function (err) {
                            console.error(err);
                            reject(err);
                        });
                }
            );
        }


        function getActuatorByID(id) {
            return new Promise(
                function (resolve, reject) {
                    $http.get('/devices/actuators/'+id)
                        .success(function (data) {
                            if(data.err) {console.error(data.err); throw new Error(data.err);}
                            resolve(data);
                        })
                        .error(function (err) {
                            console.error(err);
                            reject(err);
                        });
                }
            );
        }

        function updateActuator(actuator) {
            console.log('Scenario service before put');
            $http.put("/devices/actuators/"+actuator.id, {actuator: actuator})
                .success(function(data) {
                    if(data.error) console.error(data.error);
                    console.log('Put success');
                    console.log(data);
                })
                .error(function (err) {
                    console.log('Put fail');
                    console.error(err);
                    throw err;
                });
        }

        function isAllowedCommand(commandname) {
            console.log('Dingen yolo hier ook 100 keer per seconde? WHAT THE FUCCCKKKK!!');
            return (commandname.toLowerCase() === 'on' || commandname.toLowerCase() === 'off');

        }

        return {
            toggleState: toggleState,
            delete: deleteScenario,
            getall: getScenarios,
            get: getScenario,
            create: createScenario,
            update: update,
            getActuators: getActuators,
            getActuatorByID: getActuatorByID,
            updateActuator: updateActuator,
            isAllowedCommand: isAllowedCommand
        };

    }
})();