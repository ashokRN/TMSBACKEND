const { Module } = require("../models");
const { to, ReE, ReS, isNull } = require("../utils/Util");
const {INTERNAL_SERVER_ERROR, BAD_REQUEST, OK} = require('http-status');

exports.create = async (req, res) => {
    let [user,ReQ]  = [req.user, req.body];
 
    let err, exisitingModule, create;

    if(!ReQ.name || ReQ.name === "") {return ReE(res, {message:'Enter Module name'}, BAD_REQUEST)}

    [err, exisitingModule] = await to(Module.findOne({name: ReQ.name}));

    if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(exisitingModule){ return ReE(res, {message:'Module is already here !'}, BAD_REQUEST) }

    [err, create] = await to(Module({ name: ReQ.name, department:ReQ.department }).save());

    if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!create){ return ReE(res, {message:'Module doesn\'t create, Try again!'}, BAD_REQUEST) }

    return ReS(res, {message:'Module created!', Module:create}, OK)

}

