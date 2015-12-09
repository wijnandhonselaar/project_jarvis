(function () {
    'use strict';

    angular
        .module('jarvis.scenario')
        .factory('ScenarioService', ScenarioService);

    ScenarioService.$inject = ['$http', '$rootScope', "$timeout"];

    function ScenarioService($http, $rs, $timeout) {

        function createScenario(name, description) {
            return new Promise(
                function(resolve, reject) {
                    $http.post("/scenario", {name: name, description: description})
                        .success(function(data) {
                            if(data.err) return reject(new Error(data.err));
                            resolve(data);
                        })
                        .error(function(err) {
                            console.error(err);
                            reject(err);
                        });
                }
            );
        }

        return {
            create: createScenario
        };

    }
})();