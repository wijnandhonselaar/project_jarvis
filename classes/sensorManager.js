var sensors = [];

module.exports = {
    getAll: function () {
        return sensors;
    },

    add: function (name) {
        sensors.push({name: name});
    }
}

