(function () {
    'use strict';

    var jarvisApp = angular.module('jarvisApp', [
        'ui.router',
        'jarvis'
    ]);

    jarvisApp.config(["$stateProvider","$urlRouterProvider", function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/");
    }]);

}());