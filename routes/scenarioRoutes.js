module.exports = (function () {
    var express = require('express');
    var route = express.Router();
    var scenarioManager = require('../modules/scenarioManager');
    var logger = require('../modules/logManager');
    var conflictManager = require('../modules/conflictManager');

    // TODO replace thrown errors by error responses.
    route.get('/', function (req, res) {
        scenarioManager.getAll(function (err, result) {
            if (err) throw err;
            res.send({scenarios: result});
        });
    });

    route.post('/:id/tickle', function (req, res) {
        conflictManager.preEmptiveDetect(req.body);
        res.send('ok');
    });

    route.get('/:id', function (req, res) {
        scenarioManager.get(req.params.id, function (err, result) {
            if (err) throw err;
            res.send({scenario: result});
        });
    });

    route.post('/:id/resolveconflict', function (req, res) {
        if (req.body)
            conflictManager.resolve(req.body, function (r) {
                //res.send(r);
            }, false);
        res.send('ok');
    });

    route.post('/', function (req, res) {
        scenarioManager.getByName(req.body.name, function (scenario) {
            console.log(scenario);
            if (scenario === undefined) {
                scenarioManager.new(req.body.name, req.body.description, JSON.parse(req.body.actuators), function (err, result) {
                    if (err) throw err;
                    res.redirect('/scenario/' + result.id);
                });
            }
            else {
                res.send({err: "name"});
            }

        });
    });

    route.put('/toggle', function (req, res) {
        scenarioManager.toggleState(req.body.scenario, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

    route.put('/name/:id', function (req, res) {
        if (typeof req.body.scenario === 'string') req.body.scenario = JSON.parse(req.body.scenario);
        scenarioManager.getByName(req.body.scenario.name, function (scenario) {
            if (scenario === undefined) {
                scenarioManager.updateById(req.params.id, req.body.scenario, function (err, result) {
                    if (err) {
                        console.error(err);
                        throw err;
                    }
                    res.send({scenario: result});
                });
            } else {
                res.send({err: "name"})
            }
        })
    });

    route.put('/:id', function (req, res) {
        if (typeof req.body.scenario === 'string') req.body.scenario = JSON.parse(req.body.scenario);
        scenarioManager.updateById(req.params.id, req.body.scenario, function (err, result) {
            if (err) {
                console.error(err);
                throw err;
            }
        });
    });


route.delete('/:id', function (req, res) {
    scenarioManager.deleteById(req.params.id, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});


return route;
})
();