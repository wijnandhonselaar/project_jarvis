(function () {
    'use strict';

    angular
        .module('jarvis.scenario')
        .factory('ScenarioService', ScenarioService);

    ScenarioService.$inject = ['$http', '$rootScope', "$timeout"];

    function ScenarioService($http, $rs, $timeout) {

        function createScenario(name, description) {
            return new Promise(
                function (resolve, reject) {
                    $http.post("/scenario", {name: name, description: description})
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

        function UpdateNameorDescription(id, scenario) {
            return new Promise(
                function (resolve, reject) {
                    $http.put("/scenario/" + id, scenario)
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
                    console.log(scenario.scenario.id);
                  $http.delete("/scenario/"+scenario.scenario.id)
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


        return {
            delete: deleteScenario,
            getall: getScenarios,
            get: getScenario,
            create: createScenario,
            update: UpdateNameorDescription,
            getActuators: getActuators
        };

    }
})();