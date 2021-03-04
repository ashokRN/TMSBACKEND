const { Project } = require("../models");
const { to, ReE, ReS, isNull } = require("../utils/Util");
const {INTERNAL_SERVER_ERROR, BAD_REQUEST, OK} = require('http-status');

exports.create = async (req, res) => {

    let [user, ReQ] = [req.user, req.body];
    let err, exisitingProject, create;

    if(!user.createAuth){ return ReE(res, {message:'You can\'t create project'}, BAD_REQUEST) }

    let fields = ["name", "description"];

    let invalidFields = fields.filter(field => { if (isNull(ReQ[field])) { return true }});

    if (invalidFields.length !== 0) { return ReE( res, { message: `Ennter ${invalidFields}` }, BAD_REQUEST );}

    [err, exisitingProject] = await to(Project.findOne({Name:ReQ.name}));

    if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR)  }

    if(exisitingProject){ return  ReE(res, {message:'Project Name is already used!'}, BAD_REQUEST) }

    [err, create] = await to(Project({Name:ReQ.name, description:ReQ.description, Organaizer:user._id}).save())

    if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR)  }

    if(!create){ ReE(res, {message:'Project doesn\'t create. Try again!'}, BAD_REQUEST) }

    return ReS(res, {message:'Project created!', project:create}, OK);

}