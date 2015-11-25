var thinky = require('./thinky.js');
var type = thinky.type;

var Actuator = thinky.createModel("Actuator", {
	id: type.number().required(),
	model: {
		savedAt: type.date().default(thinky.r.now()),
		name: type.string().required(),
		sokVersion: type.number().required(),
		description: type.string(),
		commands: {
			status: type.object().required().schema({
				name: type.string().required(),
				parameters: type.object(),
				type: type.string(),
				returns: type.any().required(),
				description: type.string()
			}),
			on: type.object().required().schema({
				name: type.string().required(),
				parameters: type.object(),
				type: type.string(),
				returns: type.any().required(),
				description: type.string()
			}),
			off: type.object().required().schema({
				name: type.string().required(),
				parameters: type.object(),
				type: type.string(),
				returns: type.any().required().required(),
				description: type.string()
			})
		}
	},
	config: {
		ip: type.string().required(),
		alias: type.string()
	}
});

module.exports = Actuator;