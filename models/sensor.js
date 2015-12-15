var thinky = require('./thinky.js');
var type = thinky.type;

var Sensor = thinky.createModel("Sensor", {
    id: type.number().required(),
    savedAt: type.number().required(), // unix timestamp
    model: {
        name: type.string(),
        sokVersion: type.number().required(),
        description: type.string(),
        image: type.string(),
        commands: {
            status: type.object().required().schema({
                name: type.string().required(),
                parameters: type.object(),
                type: type.string(),
                returns: type.any().required(),
                description: type.string()
            })
        }
    },
    config: {
        ip: type.string().required(),
        alias: type.string(),
        clientRequestInterval: type.number().default(5000),
        active: type.boolean().default(true)
    },
    status: {

    }
});

module.exports = Sensor;