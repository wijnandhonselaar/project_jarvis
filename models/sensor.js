var thinky = require('./thinky.js');
var type = thinky.type;

var Sensor = thinky.createModel("Sensor", {
    id: type.number().required(),
    ip: type.string().required(),
    alias: type.string(),
    savedAt: type.date().default(thinky.r.now()),
    name: type.string(),
    sokVersion: type.number(),
    description: type.string(),
    commands: {
        status: type.object().required().schema({
            name: type.string(),
            parameters: type.object(),
            type: type.string(),
            returns: type.any(),
            description: type.string()
        })
    }
});

module.exports = Sensor;