/**
 * Created by nickyromeijn on 24/11/15.
 */
var express = require('express');
var router = express.Router();
var sok = require('../models/SOK');
var validator = require('../modules/interperter/validator');
var deviceManager = require('../modules/deviceManager');

//stringtest
//numbertest
//booltest
//listtest
router.post('/validate/:command', function(req, res){
    validator.validate(req.params.command, sok, req.body, function(interperterResponse){
        res.json(interperterResponse);
    });
});

router.post('/devices/add', function(req, res){
    deviceManager.add(req.body.device, req.body.remote);
    res.send('done');
});

router.post('/devices/delete', function(req, res){
	console.log("hier");
    deviceManager.removeAll();
    res.send('done');
});

module.exports = router;