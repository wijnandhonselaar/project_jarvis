var Log = require('../models/log');

function log(device, message, severity) {
    var log = new Log({
        device: device,
        message: message,
        severity: severity
    });
    Log.save(log).then(function(res) {
        // make sure server know there is a new log.
    }).error(function(err){
        console.log(err);
    });
}

module.exports = {
    log: log
};
