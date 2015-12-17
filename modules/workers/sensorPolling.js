"use strict";
var request = require('superagent');

//A message is send from main app to this worker.
// Message contains a list of sensors
process.on('message', function(m) {
	  	if(m.config.ip === undefined){
	  		process.send("ERROR: cannot read ip-adress of sensors");
	  	}
	  	else{
	  		request
	  		.get('http://'+ m.config.ip +'/status').send({id: m.id})
	  		.end(function(err, res){
	  			if(err){
	  				console.log(err);
	  			}
	  			else{
		     		process.send({id: m.id, status: res.body.status});
		     	}
		  });
		}
});