(function () {
    'use strict';

    angular
        .module('jarvis.log')
        .factory('LogService', LogService);

    LogService.$inject = ['$rootScope', 'socketService'];

	function LogService($rs, socket) {
		var logs = [];
		socket.socketListener("logAdded", function(data){
			data.timestamp = convertUnix(data.timestamp);
            logs.unshift(data);
            $rs.$apply();
        });

	 	return {
	 		getLogs: getLogs
        };

        function getLogs(){
        	return logs;
        }
        
		function convertUnix(unix){
			var date = new Date(unix*1000);
			var day = date.toLocaleDateString();
			var hours = date.getHours();
			var minutes = "0" + date.getMinutes();
			var seconds = "0" + date.getSeconds();
			var formattedTime = day+ ' ' +hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
			return formattedTime;
    	}
    }
})();