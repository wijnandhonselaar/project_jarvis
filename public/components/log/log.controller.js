(function() {
    'use strict';

    angular
        .module('jarvis.log')
        .controller('LogCtrl', LogCtrl);

    LogCtrl.$inject = ['LogService'];

    function LogCtrl(ls) {
        var lc = this;
        lc.logs = ls.getLogs();
  // 		$scope.reverse = function(list) {
		// 	return list.reverse(); 
		// });
    }
    	
})();