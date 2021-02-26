const { Task, Module, Project, User } = require("../models");
const { to, ReE, ReS, isNull } = require("../utils/Util");
const { INTERNAL_SERVER_ERROR, BAD_REQUEST, OK } = require("http-status");

exports.create = async (req, res) => {
  let [user, ReQ] = [req.user, req.body];
  let err, exisitingTask, create;

  let fields = ["name", "module", "project", "assign", "description"];

    let invalidFields = fields.filter(field => { if (isNull(ReQ[field])) { return true }});

    if (invalidFields.length !== 0) { return ReE( res, { message: `Ennter ${invalidFields}` }, BAD_REQUEST );}

    [err, exisitingTask] = await to(Tool.findOne({name: ReQ.name,module:ReQ.module,Project: ReQ.project }));

    if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(exisitingTask){ return ReE(res, {message:'Task is already here in This Project!'}, BAD_REQUEST) }

    [err, create] = await to(Task({
      name: ReQ.name,
      module:ReQ.module,
      Project:ReQ.project,
      assignedTo: ReQ.assign,
      Description:ReQ.description,
      assignedFrom: user._id
  }).save());

    if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!create){ return ReE(res, {message:'Task doesn\'t create, Try again!'}, BAD_REQUEST) }

    return ReS(res, {message:'Task created!', Task:create}, OK)
};
