(function() {
    'use strict';

    angular
        .module('jarvis.actuator')
        .controller('DashboardCtrl', DashboardCtrl);

    DashboardCtrl.$inject = ["DevicesService", "$state", '$scope'];

    function DashboardCtrl(DS, $state, $scope) {
        var db = this;
        DS.getDeviceById(9,'sensor')
            .then(function(data){
                db.tempSensor = data;
                $scope.$apply();
                console.log(db.tempSensor);
            })
            .catch(function(err){
                Materialize.toast("Device not found", 4000);
                console.error(err);
            });

        DS.getDeviceById(7,'sensor')
            .then(function(data){
                db.lightSensor = data;
                $scope.$apply();
                console.log(db.lightSensor);
            })
            .catch(function(err){
                Materialize.toast("Device not found", 4000);
                console.error(err);
            });

        DS.getDeviceById(0,'actuator')
            .then(function(data){
                db.lamp = data;
                $scope.$apply();
                console.log(db.lamp);
            })
            .catch(function(err){
                Materialize.toast("Device not found", 4000);
                console.error(err);
            });

        DS.getDeviceById(4,'actuator')
            .then(function(data){
                db.tv = data;
                $scope.$apply();
                console.log(db.tv);
            })
            .catch(function(err){
                Materialize.toast("Device not found", 4000);
                console.error(err);
            });
    }

})();