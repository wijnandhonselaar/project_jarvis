(function () {
    'use strict';

    angular
        .module('jarvis.log')
        .factory('LogService', LogService);

    LogService.$inject = ['$rootScope', 'socketService', '$http'];

	function LogService($rs, socket, $http) {
		var logs = [];
        var dataLog = [];
        var onLogUpdate = null;

		socket.socketListener("logAdded", function(data){
            console.log(data);
            logs.push(data);
            if(logs.length >= 50){
                logs.splice(0,1);
            }
            $rs.$apply();
            if(onLogUpdate) {
                onLogUpdate(data);
            }
        });

        socket.socketListener("dataLogAdded", function(data){
            dataLog.push(data);
            $rs.$apply();
            if(onLogUpdate) {
                onLogUpdate(data);
            }
        });

        function setOnlogUpdate(f) {
            onLogUpdate = f;
        }

        function loadLogsDetail(id, bool) {
            return new Promise(
                function (resolve, reject) {
                    $http.get("/devices/sensors/"+id+"/datalogs")
                        .success(function (data) {
                            if(bool === true){
                                var graphdata = {};
                                graphdata = setDataForGraph(data);
                                resolve(graphdata);
                            }
                            else{
                                if(data.length > 60){
                                   data.splice(60, data.length - 61);
                                }
                                for (var i = 0; i < data.length; i++) {
                                    data[i].timestamp = convertUnixTime(data[i].timestamp);
                                }
                                resolve(data);
                            }
                        })
                        .error(function (err) {
                            // ERROR
                            console.error("Error loading logs: ", err);
                            reject(err);
                        });
                }
            );
        }

        loadLogs()
            .then(function () {});

	 	return {
            loadLogs: loadLogs,
	 		getLogs: getLogs,
            setOnLogUpdate: setOnlogUpdate,
            getDatalogById: getDatalogById,
            loadLogsDetail: loadLogsDetail,
            convertUnixTime: convertUnixTime
        };

        //severity as parameter TODO
        function loadLogs(){
            return new Promise(
                function (resolve, reject) {
                    $http.get("/devices/logs?severity=5&limit=50")
                        .success(function (data) {
                            data.forEach(function (log) {
                                logs.push(log);
                            });
                            console.log(logs);
                            console.log("Got log data.");
                            resolve();
                        })
                        .error(function (err) {
                            // ERROR
                            console.error("Error loading logs: ", err);
                            reject(err);
                        });
                }
            );
        }

        function getLogs(){
        	return logs;
        }
        
        function getDatalogById(id){
            var returnArray = [];
            for (var i = 0; i < dataLog.length; i++) {
                if(dataLog[i].device.id === id){
                    returnArray.unshift(dataLog[i]);
                }
            }
            return returnArray;
        }

        function setDataForGraph(data){
            var graphData = {};
            graphData.labels = [];
            graphData.series = Object.keys(data[0].status);
            graphData.data= [];
            var unix = Math.round(+new Date()/1000);

            for (var i = 0; i < data.length; i++) {
                if((unix - data[i].timestamp) < 3600){
                    graphData.labels.unshift(convertUnixTime(data[i].timestamp));
                    for(var key in data[i].status){
                        graphData.data.unshift(data[i].status[key]);
                    }
                }
            }

            while(graphData.labels.length > 50){
                for (var x = 0; x < graphData.labels.length; x++) {
                    if(x%2 === 0){
                        graphData.labels.splice(graphData.labels.length-1,1);
                        graphData.data.splice(graphData.labels.length-1,1);
                    }
                }
            }

            var points = [0,Math.floor(graphData.labels.length/5),Math.floor(graphData.labels.length/5 *2), Math.floor(graphData.labels.length/5 *3), Math.floor(graphData.labels.length/5 *4), graphData.labels.length-1];
            for (var y = 0; y < graphData.labels.length; y++) {
                 if(points.indexOf(y) == -1){
                    graphData.labels[y] = "";
                 }
            }

            return graphData;
        }

		

        function convertUnixTime(unix){
            var date = new Date(unix*1000);
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            return formattedTime;
        }
    }
})();