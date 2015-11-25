(function () {
    'use strict';

    angular
        .module('jarvis.voorbeeld')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('home', {
                url: "/home",
                templateUrl: "components/voorbeeld/voorbeeld.html",
                controller: 'VoorbeeldCtrl',
                controllerAs: 'vc',
                data: { pageTitle: "Pagina titel" }
            });
    }

})();