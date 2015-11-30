var thinky = require('./thinky.js');
var type = thinky.type;
/**
 * device: device identifier
 * message: log message (device status)
 * severity: 1-5, 1 being the most severe.
 */
var Log = thinky.createModel("Log", {
    device: type.number().required(),
    type: type.string().required(),
    message: type.object().required(),
    severity: type.number().required(),
    //timestamp: type.string().required()
});

module.exports = Log;