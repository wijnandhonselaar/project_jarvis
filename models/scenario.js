var thinky = require('./thinky.js');
var type = thinky.type;

var Scenario = thinky.createModel("Scenario", {
    name: type.string().required(),
    description: type.string().required(),
    actuators: [
        {
            deviceid: type.number().required(),
            action: type.string().required()
        }
    ]
});

module.exports = Scenario;