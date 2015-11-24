/**
 * Created by nickyromeijn on 24/11/15.
 */
var express = require('express');
var router = express.Router();
var sok = require('../models/SOK');
var validator = require('../classes/interperter/validator');

router.post('/stringtest', function(req, res){
    validator.validate('stringtest', sok, req.body, function(interperterResponse){
        res.json(interperterResponse)
    });
});

module.exports = router;