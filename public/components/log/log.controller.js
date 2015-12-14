(function() {
    'use strict';

    angular
        .module('jarvis.log')
        .controller('LogCtrl', LogCtrl);

    LogCtrl.$inject = ['LogService'];

    function LogCtrl(ls) {
        var lc = this;
        lc.logs = ls.getLogs();
        lc.convertUnix = convertUnix;
    
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