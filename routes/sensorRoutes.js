module.exports = (function() {
    var express= require('express');
    //require('../models/Sensor');

    var route = express.Router();

    route.get('/', function(request, resp) {
        // Get all sensors
        console.log("Sensor route");
        resp.send({message: "Hoi"});
    });

    return route;
})();