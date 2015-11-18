"use strict";

var jarvisApp = angular.module('jarvisApp', [
    'ui.router',
    'jarvis'
]);

jarvisApp.config(["$stateProvider","$urlRouterProvider", function($stateProvider, $urlRouterProvider){
    //$urlRouterProvider.otherwise("/devices");
    //$stateProvider
    //    .state('devices', {
    //        url: "/devices",
    //        templateUrl: "components/devices/devices.html",
    //        controller: 'DevicesCtrl',
    //        controllerAs: 'dc',
    //        data: { pageTitle: "Devices" }
    //    })
}]);