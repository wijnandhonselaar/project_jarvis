module.exports = (function() {
    var express= require('express');
    var route = express.Router();
    var scenarioManager = require('../modules/scenarioManager');
    var logger = require('../modules/logManager');

    // TODO replace thrown errors by error responses.
    route.get('/', function(req, res) {
        scenarioManager.getAll(function(err, result) {
            if(err) throw err;
            res.send({scenarios: result});
        });
    });

    route.get('/:id', function(req, res) {
       scenarioManager.get(req.params.id, function(err, result) {
           if(err) throw err;
           res.send({scenario: result});
       });
    });

    route.post('/', function(req, res) {
        scenarioManager.new(req.body.name, req.body.description, function(err, result) {
            if(err) throw err;
            res.redirect('/scenario/'+result.id);
        });
    });

    route.put('/:id', function(req, res) {
        scenarioManager.updateById(req.params.id, req.body.scenario, function(err, result) {
            if(err) throw err;
            res.send({scenario: result});
        });
    });

    route.delete('/:id', function(req,res){
        console.log(req.params.id);
        scenarioManager.deleteById(req.params.id, function(err, result){
            if(err) throw err;
            res.send("successful", result);
        });
    });

    return route;
})();