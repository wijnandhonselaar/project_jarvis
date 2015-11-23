var devices =  {
    actuator:[],
    sensor:[]
};

function addToDeviceList(d,remote, io) {
    if(devices[d.type].length !== 0) {
        for(var i = 0; i<devices[d.type].length; i++){

            var exists = false;

            if(devices[d.type][i].id === d.id){
                exists = true;
            }
        }

        if(!exists){
            devices[d.type].push(d);
            io.emit("event", {event: "deviceschanged"});
            if(GLOBAL.logToConsole) console.log("Discovered "+ d.name + " on "+remote.address+ ' length: '+devices[d.type].length);
        }

    } else {
        devices[d.type].push(d);
        io.emit("event", {event: "deviceschanged"});
        if(GLOBAL.logToConsole) console.log("Discovered "+ d.name + " on "+remote.address+ ' length: '+devices[d.type].length);
    }
}

function getDeviceByIPAddress(ip){
    for (var property in devices) {
        if (object.hasOwnProperty(property)) {
            for(var i = 0; i<devices[property].length; i++){
                if(devices[property][i].ip == ip){
                    return devices[property][i];
                }
            }
        }
    }
    return null;
}

module.exports = {
    add: addToDeviceList,
    getByIP:getDeviceByIPAddress,
    get: function(){return devices}
};