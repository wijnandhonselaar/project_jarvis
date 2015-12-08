(function () {
    'use strict';

    angular
        .module('jarvis.scenario')
        .controller('ScenarioDetailctrl', ScenarioDetailctrl);

    ScenarioDetailctrl.$inject = [];

    function ScenarioDetailctrl() {
        var scendet = this;
        scendet.hallo = "hallo";
    }
})();