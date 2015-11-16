(function () {
    'use strict';

    angular
        .module('jarvis.title')
        .directive('titleDir', titleDir);

    function titleDir($rootScope, $timeout) {
        return {
            link: function(scope, element) {
                var listener = function(event, toState) {
                    var title = 'Jarvis Control Panel';
                    if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle;

                    $timeout(function() {
                        element.text(title);
                    }, 0, false);
                };
                $rootScope.$on('$stateChangeSuccess', listener);
            }
        };
    }

})();