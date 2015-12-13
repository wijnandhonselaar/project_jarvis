var thinky = require('./thinky.js');
var type = thinky.type;


var Settings = thinky.createModel("settings", {
    id: type.number().default(1),
    logLevel: type.number().default(4)
});

module.exports = Settings;