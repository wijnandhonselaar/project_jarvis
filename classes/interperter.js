var devices = require('./devices');
var superAgent = require('superagent');

var validators = {
    number: function (val, min, max) {
        if (typeof val == 'number') {
            return !!(val > min && val < max);
        }
        return false;
    },
    boolean: function (val) {
        return typeof val == 'boolean';
    },
    string: function (val) {
        return typeof val == 'string';
    },
    length: function (val, min, max) {
        return !!(val.length > min && val.length < max);
    },
    inList: function(val, list){
        return list.indexof(val) !== -1;
    }
};

var obj = {
    validate: function validate(command, object, paramList) {
        for (var param in object[command].parameters) {
            if (object[command].parameters.hasOwnProperty(param)) {
                var accepts = object[command].parameters.accepts;
                if(param.name in paramList) {
                    var value = paramList[param];
                    var validates = true;
                    for (var i = 0; i < accepts.length; i++) {
                        var acceptObj = accepts[i];
                        if (acceptObj.list.length > 0) {
                            validates = validators.inList(value, acceptObj.list);
                        } else {
                            for (var b = 0; b < acceptObj.limit.length; b++) {
                                if (!validators[acceptObj.limit[b].type](value, acceptObj.limit[b].min, acceptObj.limit[b].max)) {
                                    validates = false;
                                }
                            }
                        }
                    }
                } else validates = !param.required;
            }
        }
    },
    post: function(command, object, paramlist){
        if(interperter.validate(command, object, paramlist)) {
            superAgent.post('http://' + object.ip + '/' + command)
                .send(paramList)
                .end(function (err, res) {

                })
        }
    },
    get : function(command,object){
        superAgent.get('http://' + object.ip + '/' + command).end(function(err, res){
            if(err) console.log(err);
            if(GLOBAL.logToConsole) console.log(res);
        })
    }

};

module.exports = obj;