var thinky = require('./thinky.js');
var type = thinky.type;

var Sensor = thinky.createModel("Sensor", {
    id: type.number().required(),
    model: {
        savedAt: type.number().default(Math.round((new Date()).getTime() / 1000)), // unix timestamp
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
        active: type.boolean().default(true),
        rules: {
            on: {
                command: type.string().required(),
                onEvents: [
                    {
                        device: type.number().required(),
                        event: type.string().required
                    }
                ],
                thresholds: [
                    {
                        device: type.number().required(),
                        field: type.string().required(),
                        operator: type.string().required(),
                        value: type.number().required(),
                        gate : type.string().required()
                    }
                ]
            }
        }
    }
});

module.exports = Sensor;