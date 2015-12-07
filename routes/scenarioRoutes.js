module.exports = (function() {
    var express= require('express');
    var route = express.Router();
    var logger = require('../modules/logManager');

    route.get('/', function(request, resp) {
        resp.send({scenarios: scenarioManager.getAll()});
    });

    

    return route;
})();