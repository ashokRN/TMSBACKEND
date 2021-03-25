const { Task, Module, Project, User } = require("../models");
const { to, ReE, ReS, isNull } = require("../utils/Util");
const { INTERNAL_SERVER_ERROR, BAD_REQUEST, OK } = require("http-status");

exports.create = async (req, res) => {
  let [user, ReQ] = [req.user, req.body];

  let err, exisitingTask,exisitingProj, create;

  let fields = ["name", "module", "project", "assign", "description"];

    let invalidFields = fields.filter(field => { if (isNull(ReQ[field])) { return true }});

    if (invalidFields.length !== 0) { return ReE( res, { message: `Ennter ${invalidFields}` }, BAD_REQUEST );}

    [err, exisitingProj] = await to(Project.findById(ReQ.project));

    if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!exisitingProj){ return ReE(res, {message:'Project doesn\'t found!'}, BAD_REQUEST) }

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

    let saveTaskToUser;

    [err, saveTaskToUser] = await to(User.findById(ReQ.assign));

    if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!saveTaskToUser) { return ReE(res, {message:'User doesn\'t fount' }, BAD_REQUEST) }

    saveTaskToUser.tasks.push(resTask._id);

    if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!saveTaskToUser) { return ReE(res, {message:'User doesn\'t fount' }, BAD_REQUEST) }

    let saveUser;

    [err, saveUser] = await to(saveTaskToUser.save());

    if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!saveUser) { return ReE(res, {message:'User doesn\'t assign' }, BAD_REQUEST) }

    let nxtProject = exisitingProj.Modules.find(s => s.module.equals(ReQ.module));

    console.log(nxtProject, 'next');

    nxtProject.tasks.push(resTask._id);

    let saveProj;

    [err, saveProj] = await to(exisitingProj.save());

    if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!saveProj) { return ReE(res, {message:'Project doesn\'t assign' }, BAD_REQUEST) }

    return ReS(res, {message:'Task created!', Task:formatObj, user: saveUser}, OK)


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

exports.getAllByProj = async (req, res) => {

  let [user, ReQ] = [req.user, req.query];

  
  let err, exisitingTasks;

  [err, exisitingTasks] = await to(Task.find({Project:ReQ.id}).populate([{
    path:'assignedTo',
    select:["userName", "email"],
    model:"User"
  },{
    path:'assignedFrom',
    select:["userName", "email"],
    model:"User"
  },{
    path:'module',
    select:["name"],
    model:"Module"
  }]));

  

  if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

  if(exisitingTasks.length === 0){ return ReE(res, {message:'Task doesn\'t found, Try again!'}, BAD_REQUEST) }

  let tasks = [];

  for (let index = 0; index < exisitingTasks.length; index++) {
    const element = exisitingTasks[index];
    let formatObj = {
      name:element.name,
      module:element.module.name,
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
