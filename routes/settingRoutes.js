module.exports = (function() {
    var deviceManager = require('../modules/deviceManager');
    var express= require('express');
    var route = express.Router();
    var settingManager = require('../modules/settingManager');

    /**
     * START SETTINGS ROUTES
     */
    route.get('/loglevel', function(req, res) {
        settingManager.getLogLevel(function(err, result) {
            res.send(JSON.stringify(result));
        });
    });

    route.put('/loglevel', function(req, res) {
        settingManager.setLogLevel(req.body.logLevel ,function(err, result) {
            if(err) {
                res.send(JSON.stringify(err));
            } else {
                res.send(JSON.stringify(result));
            }
        });
    });

    /**
     * END SETTINGS ROUTE
     */


    return route;
})();