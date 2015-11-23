var devices = require('./devices');

module.exports = {
    getAll: function () {
        return devices.getActuators();
    }
}

