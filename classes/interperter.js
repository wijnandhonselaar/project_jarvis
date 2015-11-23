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
    string: function (val, min, max, type) {
        if (typeof val == 'string') {
            switch (type) {
                case 'length':
                    console.log('String is being validated....');
                    return !!(val.length >= min && val.length <= max);
                    break;
            }
        }
    },
    inList: function (val, list) {
        return list.indexof(val) !== -1;
    }
};

var obj = {
    validate: function validate(command, object, paramList) {
        for (var param in object.commands[command].parameters) {
            if (object.commands[command].parameters.hasOwnProperty(param)) {
                var paramObj = object.commands[command].parameters[param];
                var accepts = paramObj.accepts;
                if (param in paramList) {
                    if (GLOBAL.logToConsole) console.log('found '+ param +' in paramlist');
                    var value = paramList[param];
                    var validates = true;
                    for (var i = 0; i < accepts.length; i++) {
                        var acceptObj = accepts[i];
                        if (paramObj.list.length > 0) {
                            validates = validators.inList(value, acceptObj.list);
                        } else {
                            for (var b = 0; b < acceptObj.limit.length; b++) {
                                var limitObj = acceptObj.limit[b];
                                if (!validators[acceptObj.type](value, limitObj.min, limitObj.max, limitObj.type)) {
                                    validates = false;
                                } else {
                                    console.log('Param '+param+' passed validation');
                                }
                            }
                        }
                    }
                } else validates = !param.required;
            }
        }
    },
    post: function (command, object, paramlist, cb) {
        if (obj.validate(command, object, paramlist)) {
            superAgent.post('http://' + object.ip + '/' + command)
                .send(paramList)
                .end(function (err, res) {
                    if (err) console.log(err);
                    if (GLOBAL.logToConsole) console.log(res);
                    cb(res)
                })
        }
    },
    get: function (command, object, cb) {
        superAgent.get('http://' + object.ip + '/' + command).end(function (err, res) {
            if (err) console.log(err);
            if (GLOBAL.logToConsole) console.log(res);
            cb(res)
        })
    }

};

module.exports = obj;