(function () {
    'use strict';

    angular
        .module('jarvis.scenario')
        .controller('ScenarioNewctrl', ScenarioNewctrl);

    ScenarioNewctrl.$inject = [];

    function ScenarioNewctrl() {
        var scennew = this;
        scennew.new = "new";
    }
})();