(function () {
    'use strict';

    angular
        .module('jarvis.editdir')
        .directive('editDir', editDir);

    editDir.$inject = ['$timeout'];

    function editDir($timeout) {
        return {
            restrict: 'A',
            link: function (scope, ele, attr) {
                $(ele).focus(function(){
                    $(ele).css("background-color", "#ffffff");
                });
                $(ele).blur(function() {
                    $(ele).css("background-color", "inherit");
                });
                $(ele).css("background-color","inherit");
                $(ele).css("border", "0px");
                $(ele).click(function(){
                    $timeout(function(){
                        $(ele).keyboard({});
                    });
                });
            }
        };

    }

})();