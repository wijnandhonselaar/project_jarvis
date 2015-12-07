var deviceManager = require('./deviceManager');
var comm = require('./interperter/comm');

function validateStatement(var1, var2, operator){
    var statements = {
        '>' : var1 > var2,
        '>=': var1 >= var2,
        '<' : var1 < var2,
        '<=': var1 <= var2,
        '==' : var1 == var2,
        '===': var1 === var2,
        '!=': var1 != var2,
        '!==': var1 !== var2
    };
    return statements[operator];
}


/*
Rules [
    {
        command: on,
        onEvents: [
                {
                    device : 1337 (koffiezetapparaat),
                    event: onFinish
                }
            ],
        treshholds: [
                {
                    device : 111 (sensor),
                    field: 'celsius',
                    operator: '>',
                    value: 25,
                    gate : 'AND',
                },
                {
                    device 112
                    field: 'humidity',
                    operator: '===',
                    value 70
                    gate : 'OR'
                }
            ]

    }
]
*/

//function apply(device, event){
//    var rules = device.rules;
//    comm.post()
//}

module.exports = {
    apply:apply
};