var thinky = require('./thinky.js');
var type = thinky.type;
/**
 * device: device identifier
 * type: sensor / actuator
 * message: log message (device status)
 * severity: 1-5, 1 being the most severe.
 * category: category (manual/automatic)
 * timestamp: timestamp
 */
var Log = thinky.createModel("eventLog", {
    device: {
        id: type.number(),
        name: type.string(),
        alias: type.string()
    },
    type: type.string().required(),
    message: type.string().required(),
    severity: type.number().required(),
    category: type.string().required(),
    timestamp: type.number().required() // unix timestamp
});

module.exports = Log;