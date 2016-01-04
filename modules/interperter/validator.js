/*jslint node: true */
"use strict";
var devices = require('../deviceManager');

/**
 * validator function mapped to the paramter types which are defineable in the SOK protocol definiton
 * List, number, boolean and string
 * @type {{number: Function, boolean: Function, string: Function, inList: Function}}
 */
var validators = {
    number: function (val, min, max) {
        val = parseFloat(val);
        var res = {};
        res.validated = false;
        if (typeof val == 'number' && !isNaN(val)) {
            if (GLOBAL.logToConsole) console.log('Number is being validated....');
            res.validated = !!(val >= min && val <= max);
            if(!res.validated) res.err = 'Nummer is te hoog of te laag nummer:'+val+' min:'+min+' max:'+max;

        } else {
            res.err = 'Value is geen nummer';
        }
        return res;
    },
    boolean: function (val) {
        switch(val){
            case 'true':
            case '1':
                val = true;
                break;
            case 'false':
            case '0':
                val = false;
                break;
        }
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
        if(!isNaN(val)) val = parseFloat(val);
        var res = {};
        res.validated = false;
        res.validated = list.indexOf(val) !== -1;
        if(!res.validated) res.err = 'Value not in predefined param list: ' + list;
        return res;
    }
};

/**
 * Function validates incoming command against given parameters; checks if given arguments validate as given by the SOK definition
 * @param command commandString which indicates what command is being executed
 * @param object deviceObject (sok definition)
 * @param paramList json object with key/value pairs of arguments (name must match the name in the sok definition)
 * @param callback -- speaks for itself (returns object with all parameters and if they are validated or not)
 */

function validateCommand(command, device, paramList, callback) {

    var validatedParams = {};

    for (var param in device.model.commands[command].parameters) {
        if (device.model.commands[command].parameters.hasOwnProperty(param)) {

            validatedParams[param] = {};

            validatedParams[param].validated = true;

            var paramObj = device.model.commands[command].parameters[param];

            var accepts = paramObj.accepts;
            var validates = null;

            if (param in paramList) {

                if (GLOBAL.logToConsole) console.log('Found ' + param + ' in paramlist');

                var value = paramList[param];
                validates = true;

                for (var i = 0; i < accepts.length; i++) {
                    var acceptObj = accepts[i];
                    if (paramObj.list && paramObj.list.length > 0) {
                        validatedParams[param] = validators.inList(value, paramObj.list);
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

            } else {
                validates = !param.required;
            }
        }
    }
    if (GLOBAL.logToConsole) console.log(validatedParams);
    callback(validatedParams);
}

/**
 * Export object, returns object with a single validate function (check parameters of the validateCommand function for documentation)
 * @type {{validate: Function}}
 */

var obj = {
    validate: function (command, object, paramlist, cb) {
        validateCommand(command, object, paramlist, function(validationList){
            cb(validationList);
        });
    }
};

module.exports = obj;