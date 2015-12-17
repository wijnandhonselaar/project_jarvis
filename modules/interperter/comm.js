"use strict";
var validator = require('./validator');
var superAgent = require('superagent');
var logger = require('../logManager');

var postMethod = function(command, deviceObject, paramList, callback){
    validator.validate(command, deviceObject, paramList, function(data){
        var everythingIsValidated = true;
        for (var property in data) {
            if (data.hasOwnProperty(property)) {
                if(!data[property].validated) everythingIsValidated = false;
            }
        }
        if(everythingIsValidated) {
            paramList.id = deviceObject.id;
            //console.log('Posting to: http://' + deviceObject.config.ip + '/' + command);
            superAgent.post('http://' + deviceObject.config.ip + '/' + command).send(paramList).end(function (err, res) {
                if(err) {
                    console.log(err);
                } else {
                    logger.logEvent(deviceObject, deviceObject.model.type, "undefined" ,deviceObject.model.name + " heeft commando: "+command+" uitgevoerd.", 4);
                    callback(res.body, deviceObject);
                }
            });
        } else {
            logger.logEvent(deviceObject, deviceObject.model.type, "undefined" ,deviceObject.model.name + " heeft commando: "+command+" uitgevoerd. Maar er was een error.", 2);
            callback(data);
        }
    });
};

var getMethod = function(command, deviceObject, callback){
    superAgent.get('http://'+deviceObject.config.ip+'/'+command).end(function(err,res){
        if(err) console.log(err);
        callback(res.text);
    });
};

module.exports = {
    post : postMethod,
    get : getMethod
};