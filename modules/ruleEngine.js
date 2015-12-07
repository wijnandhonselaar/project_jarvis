
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

function apply(statements){
    for(var i = 0; i<statements.length; i++){
        var gate = statements[i].gate;
    }
}

module.exports = {
    apply:apply
};