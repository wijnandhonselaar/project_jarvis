(function () {
    'use strict';

    angular.module('jarvis', [
        'templatecache',
        'rzModule',
        'jarvis.reverseFilter',
        'jarvis.clock',
        'jarvis.editdir',
        'jarvis.header',
        'jarvis.title',
        'jarvis.socketService',
        'jarvis.devices',
        'jarvis.log',
        'jarvis.menu',
        'jarvis.sensor',
        'jarvis.actuator',
        'jarvis.dashboard',
        'jarvis.scenario',
        'jarvis.settings',
        'jarvis.ruleEngine',
        'jarvis.ruleEngineScenarios'
    ]);
}());