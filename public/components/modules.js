(function () {
    'use strict';

    angular.module('jarvis', [
        'templatecache',
        'rzModule',
        'jarvis.clock',
        'jarvis.title',
        'jarvis.socketService',
        'jarvis.devices',
        'jarvis.log',
        'jarvis.menu',
        'jarvis.sensor',
        'jarvis.actuator',
        'jarvis.dashboard'
    ]);
}());