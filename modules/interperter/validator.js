var devices = require('../deviceManager');

var validators = {
    number: function (val, min, max) {
        var res = {};
        res.validated = false;
        if (typeof val == 'number' && !isNaN(val)) {
            if (GLOBAL.logToConsole) console.log('Number is being validated....');
            res.validated = !!(val > min && val < max);
            if(!res.validated) res.err = 'Nummer is te hoog of te laag nummer:'+val+' min:'+min+' max:'+max;

        } else {
            res.err = 'Value is geen nummer';
        }
        return res;
    },
    boolean: function (val) {
        if (GLOBAL.logToConsole) console.log('Boolean is being validated....');
        var res = {};
        res.validated = typeof val == 'boolean';
        if(!res.validated) res.err = 'Value is geen boolean';
        return res;
    },
    string: function (val, min, max, type) {
        var res = {};
        res.validated = false;
        if (typeof val == 'string') {
            switch (type) {
                case 'length':
                    if (GLOBAL.logToConsole) console.log('String is being validated....');

                    res.validated = !!(val.length >= min && val.length <= max);
                    if(!res.validated) res.err = 'String is te kort of te lang string:'+val.length+' min:'+min+' max:'+max;
                    break;
            }
        } else {
            res.err = 'Value is geen string';
        }
        return res;
    },
    inList: function (val, list) {
        var res = {};
        res.validated = false;
        res.validated = list.indexof(val) !== -1;
        if(!res.validated) res.err = 'Value not in predefined param list';
        return res;
    }
};

function validateCommand(command, object, paramList, callback) {

    var validatedParams = {};

    for (var param in object.commands[command].parameters) {

        if (object.commands[command].parameters.hasOwnProperty(param)) {
            validatedParams[param] = {};
            validatedParams[param].validated = true;
            var paramObj = object.commands[command].parameters[param];
            var accepts = paramObj.accepts;

            if (param in paramList) {

                if (GLOBAL.logToConsole) console.log('Found ' + param + ' in paramlist');

                var value = paramList[param];
                var validates = true;

                for (var i = 0; i < accepts.length; i++) {
                    var acceptObj = accepts[i];
                    if (paramObj.list.length > 0) {
                        validates = validators.inList(value, acceptObj.list);
                    } else {
                        for (var b = 0; b < acceptObj.limit.length; b++) {
                            var limitObj = acceptObj.limit[b];
                            var validatorResponse = validators[acceptObj.type](value, limitObj.min, limitObj.max, limitObj.type);
                            if (!validatorResponse.validated) {
                                validatedParams[param] = validatorResponse;
                            } else {
                                if (GLOBAL.logToConsole) console.log('Param ' + param + ' passed validation');
                            }
                        }
                    }
                }

            } else validates = !param.required;
        }
    }
    if (GLOBAL.logToConsole) console.log(validatedParams);
    callback(validatedParams)
}

var obj = {
    validate: function (command, object, paramlist, cb) {
        validateCommand(command, object, paramlist, function(validationList){
            cb(validationList);
        });
    }
};

module.exports = obj;