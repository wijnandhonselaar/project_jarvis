/**
 * Created by nickyromeijn on 24/11/15.
 */
var express = require('express');
var router = express.Router();
var sok = require('../models/SOK');
var validator = require('../modules/interperter/validator');

router.post('/validate/string', function(req, res){
    validator.validate('stringtest', sok, req.body, function(interperterResponse){
        res.json(interperterResponse)
    });
});

router.post('/validate/number', function(req,res){
    validator.validate('numbertest', sok, req.body, function(interperterResponse){
        res.json(interperterResponse)
    })
});

router.post('/validate/bool', function(req,res){
    validator.validate('booltest', sok, req.body, function(interperterResponse){
        res.json(interperterResponse)
    })
});

router.post('/validate/list', function(req,res){
    validator.validate('listtest', sok, req.body, function(interperterResponse){
        res.json(interperterResponse)
    })
});

module.exports = router;