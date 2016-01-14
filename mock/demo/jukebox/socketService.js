/**
 * Created by Ivo Brands on 7-1-2016.
 */
theApp.service('socket', function() {
    this.socket = io('http://localhost:5555/');

    this.on = function(eventName, callback) {
        if (this.socket) {
            this.socket.on(eventName, function(data) {
                callback(data);
            });
        }
    };

    this.emit = function(eventName, data) {
        if (this.socket) {
            this.socket.emit(eventName, data);
        }
    };

    this.removeListener = function(eventName) {
        if (this.socket) {
            this.socket.removeListener(eventName);
        }
    };
});