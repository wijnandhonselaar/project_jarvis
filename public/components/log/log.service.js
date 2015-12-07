(function () {
    'use strict';

    angular
        .module('jarvis.devices')
        .factory('LogService', LogService);

    LogService.$inject = ['$rootScope', 'socketService'];

	function LogService($rs, socket) {
		var logs = [];
		socket.socketListener("logAdded", function(data){
            console.log(data);
            $rs.$apply();
        });

    }
})();