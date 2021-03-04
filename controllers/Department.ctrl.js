const { Department } = require("../models");
const { to, ReE, ReS, isNull } = require("../utils/Util");
const {INTERNAL_SERVER_ERROR, BAD_REQUEST, OK} = require('http-status');

exports.create = async (req, res) => {
    let [user,ReQ]  = [req.user, req.body];

    let err, exisitingDepartment, create;

    if(!ReQ.name || ReQ.name === "") {return ReE(res, {message:'Enter Department name'}, BAD_REQUEST)}

    [err, exisitingDepartment] = await to(Department.findOne({name: ReQ.name}));

    if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(exisitingDepartment){ return ReE(res, {message:'Department is already here !'}, BAD_REQUEST) }

    [err, create] = await to(Department({ name: ReQ.name }).save());

    if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!create){ return ReE(res, {message:'Department doesn\'t create, Try again!'}, BAD_REQUEST) }

    return ReS(res, {message:'Department created!', Department:create}, OK)

}

exports.getAll = async (req, res) => {
    let user = req.user;

    let err, exisitingDepartments;

    [err, exisitingDepartments] = await to(Department.find({}));

    if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(exisitingDepartments?.length === 0) { return ReE(res, {message:'Doesn\'t Have any Departments'}, BAD_REQUEST) }

    return ReS(res, {message:'Department found!', Department: exisitingDepartments}, OK);
}