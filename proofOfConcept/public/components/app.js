"use strict";

var jarvisApp = angular.module('jarvisApp', [
    'ui.router',
    'jarvis'
]);

jarvisApp.config(["$stateProvider","$urlRouterProvider", function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/deviceManager");
    $stateProvider
        .state('deviceManager', {
            url: "/deviceManager",
            templateUrl: "components/deviceManager/deviceManager.html",
            controller: 'DevicesCtrl',
            controllerAs: 'dc',
            data: { pageTitle: "Devices" }
        })
}]);