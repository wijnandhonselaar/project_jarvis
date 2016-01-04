var PORT = 80;
var UDPPORT = 3221;

var broadcastTime = 500;
var broadcastAddress = "0.0.0.0";
//var broadcastAddress = "255.255.255.255";

var actuatoren = {
	 lampen 		: 3,
	 rolluiken 		: 2,
	 ramen 			: 2,
	 verwarmingen 	: 3,
	 tvs 			: 1,
	 deursloten 	: 2
};

var sensoren  = {
	 lichtsensoren			:5,
	 temperatuursensoren	:5,
	 vochtsensoren			:5
};


//DONT EDIT BELOW
var numberOfActuators = 0;
for (var key in actuatoren) {
  if (actuatoren.hasOwnProperty(key)) {
	numberOfActuators += actuatoren[key];
  }
}
var numberOfSensors = 0;
for (var key in sensoren) {
  if (sensoren.hasOwnProperty(key)) {
	numberOfSensors += sensoren[key];
  }
}

module.exports = {
	UDPPORT: UDPPORT,
	PORT: PORT,
	actuatoren : actuatoren,
	sensoren : sensoren,
	numberOfActuators : numberOfActuators,
	numberOfSensors : numberOfSensors,
    broadcastTime : broadcastTime,
    broadcastAddress : broadcastAddress
};

