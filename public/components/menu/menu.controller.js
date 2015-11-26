(function() {
    'use strict';

    angular
        .module('jarvis.menu')
        .controller('MenuCtrl', MenuCtrl);

    MenuCtrl.$inject = ["$stateParams"];

    function MenuCtrl($stateParams) {
        var mc = this;
        mc.active = $stateParams.activeMenu;
        console.log(mc.active);


    }

})();