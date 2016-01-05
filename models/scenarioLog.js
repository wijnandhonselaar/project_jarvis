var thinky = require('./thinky.js');
var type = thinky.type;
/**
 * name: scenario name
 * status: status
 * timestamp: timestamp
 */
var Log = thinky.createModel("scenarioLog", {
    name: type.string().required(),
    status: type.boolean().required(),
    message: type.string().required(),
    severity: type.number().required(),
    timestamp: type.number().required() // unix timestamp
});

module.exports = Log;