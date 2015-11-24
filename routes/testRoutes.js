/**
 * Created by nickyromeijn on 24/11/15.
 */
var express = require('express');
var router = express.Router();
var sok = require('../models/SOK');
var validator = require('../modules/interperter/validator');

//stringtest
//numbertest
//booltest
//listtest
router.post('/validate/:command', function(req, res){
    validator.validate(req.params.command, sok, req.body, function(interperterResponse){
        res.json(interperterResponse)
    });
});

module.exports = router;