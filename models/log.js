var thinky = require('./thinky.js');
var type = thinky.type;
/**
 * device: device identifier
 * type: sensor / actuator
 * message: log message (device status)
 * severity: 1-5, 1 being the most severe.
 * category: category
 * manual: boolean
 * timestamp: timestamp
 */
var Log = thinky.createModel("Log", {
    device: type.number().required(),
    type: type.string().required(),
    message: type.object().required(),
    severity: type.number().required(),
    category: type.string().required(),
    timestamp: type.string().required()
});

module.exports = Log;