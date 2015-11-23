var thinky = require('./thinky.js');
var type = thinky.type;

var Sensor = thinky.createModel("Sensor", {
    id: type.number().required(),
    alias: type.string(),
    savedAt: type.date().default(thinky.r.now()),
    name: type.string(),
    sokVersion: type.number(),
    description: type.string(),
    commands: [{
    	name: type.string(),
    	parameters: [type.string()],
    	requestInterval: type.number(),
    	httpMethod: type.string(),
    	returns: {

    	},
    	description: type.string()
    }]
});

module.exports = Sensor;