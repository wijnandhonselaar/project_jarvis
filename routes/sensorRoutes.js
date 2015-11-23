module.exports = (function() {
    var sensorManager = require('../classes/sensorManager');
    var express= require('express');

    var route = express.Router();

    route.get('/', function(request, resp) {
        resp.send({sensors: sensorManager.getAll()});
    });

    return route;
})();