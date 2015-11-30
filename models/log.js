var thinky = require('./thinky.js');
var type = thinky.type;

var Log = thinky.createModel("Log", {
    device: type.string().required(),
    message: type.string().required(),
    severity: type.number().required()
});

module.exports = Log;