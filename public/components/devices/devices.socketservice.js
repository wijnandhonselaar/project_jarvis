/**
 * Created by developer on 26-11-15.
 */
/**
 * Created by Ivo Brands on 26-11-2015.
 */
(function () {
    'use strict';

    angular
        .module('jarvis.socketService')
        .factory('socketService', socketService);

    socketService.$inject = [];

    function socketService() {
        var socket = io.connect('http://localhost:3221');


        function socketListener(socketType, cb) {
            socket.on(socketType, function (data) {
                cb(data);
            });
        }

        function socketEmit(requestType, requestData){
           socket.emit(requestType, requestData);
        }

    }
    return {
        socketListener: socketListener,
        socketEmit: socketEmit
    };
})();