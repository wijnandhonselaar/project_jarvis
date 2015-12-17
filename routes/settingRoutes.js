"use strict";
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
            res.send({loglevel: result});
        });
    });

    route.put('/loglevel', function(req, res) {
        settingManager.setLogLevel(req.body.logLevel ,function(err, result) {
            if(err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    });

    /**
     * END SETTINGS ROUTE
     */


    return route;
})();