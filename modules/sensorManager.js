var devices = require('./deviceManager');

module.exports = {
    getAll: function () {
        return devices.getSensors();
    }
}

