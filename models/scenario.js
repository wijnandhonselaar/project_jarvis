var thinky = require('./thinky.js');
var type = thinky.type;

var Scenario = thinky.createModel("Scenario", {
    name: type.string().required(),
    description: type.string().required(),
    actuators: [
        {
            deviceid: type.number().required(),
            action: type.object({
                command: type.string().required(),
                parameters: [
                    type.object()
                ]
            }).required(),
            priority: type.number()
        }
    ]
});

module.exports = Scenario;