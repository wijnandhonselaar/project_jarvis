var request = require('superagent');

//A message is send from main app to this worken.
// Message contains a list of sensors
process.on('message', function(m) {
	  	if(m.ip === undefined){
	  		process.send("ERROR: cannot read ip-adress of sensor");
	  	}
	  	else{
	  		request
	  		.get(m.ip +'/status')
	  		.end(function(err, res){
		     // if (res.status === 200) {
		     	process.send(m.id);
		     // } 
		     // else {
		     //   console.log('Oh no! error ' + res.text);
		     // }
		  });
		}
});