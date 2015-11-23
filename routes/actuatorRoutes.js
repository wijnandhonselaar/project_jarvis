module.exports = (function() {
    var actuatorManager = require('../classes/actuatorManager');
    var express= require('express');

    var route = express.Router();

    route.get('/', function(request, resp) {
        resp.send({actuators: actuatorManager.getAll()});
    });

    return route;
})();