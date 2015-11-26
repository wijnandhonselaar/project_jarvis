var validator = require('./validator');
var superAgent = require('superagent');

var postMethod = function(command, deviceObject, paramList, callback){
    validator.validate(command, deviceObject, paramList, function(data){
        var everythingIsValidated = true;
        for (var property in data) {
            if (data.hasOwnProperty(property)) {
                if(!property.validated) everythingIsValidated = false
            }
        }
        if(everythingIsValidated) {
            superAgent.post('http://' + deviceObject.config.ip + '/' + command).send(paramList).end(function (err, res) {
                if(err) console.log(err);
                callback(res.text);
            });
        } else {
            callback(data);
        }
    })
};

var getMethod = function(command, deviceObject, callback){
    superAgent.get('http://'+deviceObject.config.ip+'/'+command).end(function(err,res){
        if(err) console.log(err);
        callback(res.text);
    })
};

module.exports = {
    post : postMethod,
    get : getMethod
};