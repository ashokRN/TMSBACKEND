const { Task, Module, Project, User } = require("../models");
const { to, ReE, ReS, isNull } = require("../utils/Util");
const { INTERNAL_SERVER_ERROR, BAD_REQUEST, OK } = require("http-status");

exports.create = async (req, res) => {
  let [user, ReQ] = [req.user, req.body];

  let err, exisitingTask, create;

  let fields = ["name", "module", "project", "assign", "description"];

    let invalidFields = fields.filter(field => { if (isNull(ReQ[field])) { return true }});

    if (invalidFields.length !== 0) { return ReE( res, { message: `Ennter ${invalidFields}` }, BAD_REQUEST );}

    [err, exisitingTask] = await to(Task.findOne({name: ReQ.name,module:ReQ.module,Project: ReQ.project }));

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

    let resTask;

    [err, resTask] = await to(Task.findById(create._id).populate([{
      path:'assignedTo',
      select:["userName", "email"],
      model:"User"
    },{
      path:'assignedFrom',
      select:["userName", "email"],
      model:"User"
    }]));

    if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!resTask){ return ReE(res, {message:'Task doesn\'t found, Try again!'}, BAD_REQUEST) }

    let formatObj = {
      name:resTask.name,
      assignedTo:resTask.assignedTo.userName,
      assignedFrom:resTask.assignedFrom.userName,
      status:resTask.status,
      Description:resTask.Description
    };

    return ReS(res, {message:'Task created!', Task:formatObj}, OK)


};

exports.getAll = async (req, res) => {

  let [user, ReQ] = [req.user, req.query];

  console.log(ReQ, 'req');
  
  let err, exisitingTasks;

  [err, exisitingTasks] = await to(Task.find(ReQ).populate([{
    path:'assignedTo',
    select:["userName", "email"],
    model:"User"
  },{
    path:'assignedFrom',
    select:["userName", "email"],
    model:"User"
  }]));

  

  if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

  if(exisitingTasks.length === 0){ return ReE(res, {message:'Task doesn\'t found, Try again!'}, BAD_REQUEST) }

  let tasks = [];

  for (let index = 0; index < exisitingTasks.length; index++) {
    const element = exisitingTasks[index];
    let formatObj = {
      name:element.name,
      assignedTo:element.assignedTo.userName,
      assignedFrom:element.assignedFrom.userName,
      status:element.status,
      Description:element.Description
    };
    tasks.push(formatObj);
  }

  if(tasks.length === exisitingTasks.length){
    return ReS(res, {message:'Task founded!', Tasks:tasks}, OK);
  }

}
