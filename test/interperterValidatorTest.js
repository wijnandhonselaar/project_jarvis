var superAgent = require('superagent')

/** ------------------------------------------------------------------------
 * String VALIDATOR
 * -------------------------------------------------------------------------
 */
it('Should validate the stringtest command with a string as parameter between 1-5 length', function (done) {
    superAgent.post('http://localhost:3221/test/validate/stringtest')
        .send({naam: 'Hallo'})
        .end(function (err, res) {
            if (res.body.naam.validated) {
                done();
            } else {
                done(res.body.naam.err);
            }
        })
});

it('Should NOT validate the stringtest command with a string as parameter between 1-5 length (length 11)', function (done) {
    superAgent.post('http://localhost:3221/test/validate/stringtest')
        .send({naam: 'Hallooooooo'})
        .end(function (err, res) {
            if (!res.body.naam.validated) {
                done();
            } else {
                done(res.body.naam.err);
            }
        })
});


/** ------------------------------------------------------------------------
 * NUMBER VALIDATOR
 * -------------------------------------------------------------------------
 */
it('Should validate the numbertest command with a number as parameter between 1-512 (value 25)', function (done) {
    superAgent.post('http://localhost:3221/test/validate/numbertest')
        .send({nummer: '25'})
        .end(function (err, res) {
            if (res.body.nummer.validated === true) {
                done();
            } else {
                done(res.body.nummer.err);
            }
        })
});

it('Should NOT validate the numbertest command with a number as parameter between 1-512 (value 550)', function (done) {
    superAgent.post('http://localhost:3221/test/validate/numbertest')
        .send({nummer: '550'})
        .end(function (err, res) {
            if (res.body.nummer.validated !== true) {
                done();
            } else {
                done(res.body.nummer.err);
            }
        })
});

it('Should NOT validate the numbertest command with a number as parameter (Value string)', function (done) {
    superAgent.post('http://localhost:3221/test/validate/numbertest')
        .send({nummer: 'string'})
        .end(function (err, res) {
            if (res.body.nummer.validated !== true) {
                done();
            } else {
                done(res.body.nummer.err);
            }
        })
});

/** ------------------------------------------------------------------------
 * BOOL VALIDATOR
 * -------------------------------------------------------------------------
 */
it('Should validate the booltest command with a boolstring as parameter (Value true)', function (done) {
    superAgent.post('http://localhost:3221/test/validate/booltest')
        .send({bool: 'true'})
        .end(function (err, res) {
            if (res.body.bool.validated === true) {
                done();
            } else {
                done(res.body.bool.err);
            }
        })
});

it('Should validate the booltest command with a boolstring as parameter (Value false)', function (done) {
    superAgent.post('http://localhost:3221/test/validate/booltest')
        .send({bool: 'false'})
        .end(function (err, res) {
            if (res.body.bool.validated === true) {
                done();
            } else {
                done(res.body.bool.err);
            }
        })
});

it('Should validate the booltest command with a boolstring as parameter (Value 1)', function (done) {
    superAgent.post('http://localhost:3221/test/validate/booltest')
        .send({bool: '1'})
        .end(function (err, res) {
            if (res.body.bool.validated === true) {
                done();
            } else {
                done(res.body.bool.err);
            }
        })
});

it('Should validate the booltest command with a boolstring as parameter (Value 0)', function (done) {
    superAgent.post('http://localhost:3221/test/validate/booltest')
        .send({bool: '0'})
        .end(function (err, res) {
            if (res.body.bool.validated === true) {
                done();
            } else {
                done(res.body.bool.err);
            }
        })
});

it('Should NOT validate the booltest command with a boolstring as parameter (Value hallo)', function (done) {
    superAgent.post('http://localhost:3221/test/validate/booltest')
        .send({bool: 'hallo'})
        .end(function (err, res) {
            if (res.body.bool.validated !== true) {
                done();
            } else {
                done(res.body.bool.err);
            }
        })
});



/** ------------------------------------------------------------------------
 * Predefined param list VALIDATOR
 * -------------------------------------------------------------------------
 */
it('Should validate the listtest command with a value that is available in a pre-defined list: [1,2,3,4,5] (value 3)', function (done) {
    superAgent.post('http://localhost:3221/test/validate/listtest')
        .send({value: '3'})
        .end(function (err, res) {
            if (res.body.value.validated === true) {
                done();
            } else {
                done(res.body.value.err);
            }
        })
});

it('Should NOT validate the listtest command with a value that is available in a pre-defined list: [1,2,3,4,5] (value 21) ', function (done) {
    superAgent.post('http://localhost:3221/test/validate/listtest')
        .send({value: '21'})
        .end(function (err, res) {
            if (res.body.value.validated !== true) {
                done();
            } else {
                done(res.body.value.err);
            }
        })
});