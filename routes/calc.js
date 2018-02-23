var express = require('express');
var router = express.Router();

var invalid = function(vari){
    if(vari === undefined || vari === '' || vari === null){
        return true
    }else{
        return false
    }
};

var invalidop = function(op){
    var allowedop = ['+','-','*','/'];
    if(allowedop.indexOf(op) === -1){
        return true
    }else{
        return false
    }
};

var JustDoIt = function(req, res, next) {
    var num1 = req.body.num1;
    var num2 = req.body.num2;
    var op = req.body.op;

    if(invalid(num1) || invalid(num2) || invalid(op) || invalidop(op)){
        var err = new Error('Invalid Input');
        err.status = 500;
        next(err);
        return;
    }

    try{
        ans = eval(num1+op+num2);
        res.json({
            "answer": ans.toString()
        });
        return;
    }catch(err){
        var err = new Error(err);
        err.status = 500;
        next(err);
        return;
    }
};

router.post('/calculate', JustDoIt);
module.exports = router;
