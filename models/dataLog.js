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
var Log = thinky.createModel("dataLog", {
    device: {
        id: type.number().required(),
        name: type.string().required(),
        alias: type.string()
    },
    value: type.number().required(),
    timestamp: type.number().required() // unix timestamp
});

module.exports = Log;