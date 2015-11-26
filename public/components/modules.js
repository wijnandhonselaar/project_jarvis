(function () {
    'use strict';

    angular.module('jarvis', [
        'templatecache',
        'jarvis.clock',
        'jarvis.title',
        'jarvis.devices',
        'jarvis.log',
        'jarvis.menu',
        'jarvis.sensor',
        'jarvis.actuator'
    ]);

}());