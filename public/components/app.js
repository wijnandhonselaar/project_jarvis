"use strict";

var jarvisApp = angular.module('jarvisApp', [
    'ui.router',
    'jarvis'
]);

jarvisApp.config(["$stateProvider","$urlRouterProvider", function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/home");
    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "components/voorbeeld/voorbeeld.html",
            controller: 'VoorbeeldCtrl',
            controllerAs: 'vb',
            data: { pageTitle: "JCP - Home" }
        })
}]);