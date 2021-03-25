const { Project, Module, User } = require("../models");
const { to, ReE, ReS, isNull } = require("../utils/Util");
const {INTERNAL_SERVER_ERROR, BAD_REQUEST, OK} = require('http-status');

exports.create = async (req, res) => {

    let [user, ReQ] = [req.user, req.body];
    let err, exisitingProject, create;

    if(!user.createAuth){ return ReE(res, {message:'You can\'t create project'}, BAD_REQUEST) }

    let fields = ["name", "description", "department"];

    let invalidFields = fields.filter(field => { if (isNull(ReQ[field])) { return true }});

    if (invalidFields.length !== 0) { return ReE( res, { message: `Ennter ${invalidFields}` }, BAD_REQUEST );}

    [err, exisitingProject] = await to(Project.findOne({Name:ReQ.name}));

    if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR)  }

    if(exisitingProject){ return  ReE(res, {message:'Project Name is already used!'}, BAD_REQUEST) }

    [err, create] = await to(Project({Name:ReQ.name, description:ReQ.description, Organaizer:user._id, department:ReQ.department}).save())

    if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR)  }

    if(!create){ ReE(res, {message:'Project doesn\'t create. Try again!'}, BAD_REQUEST) }

    return ReS(res, {message:'Project created!', project:create}, OK);

}

exports.getAll = async (req, res)  => {

    let [user,ReQ]  = [req.user, req.query];

    let err, exisitingProject;


    const _queryWithProjects = async () => {

        [err, exisitingProject] = await to(Project.find({department: ReQ.department}).populate('department'));

        if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

        if(exisitingProject?.length < 0) { return ReE(res,{message:`Doesn\'t  found any Projects for ${ReQ.department} `}, BAD_REQUEST)}

        return ReS(res, {message:`Projects Found!`, Projects:exisitingProject}, OK);
    }

    const _queryWithoutProjects = async () => {

        [err, exisitingProject] = await to(Project.find({}).populate('department'));

        if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

        if(exisitingProject?.length < 0) { return ReE(res,{message:`Doesn\'t  found any Projects `}, BAD_REQUEST)}

        return ReS(res, {message:`Projects Found!`, Projects:exisitingProject}, OK);
    }


    if(ReQ.department !== "") _queryWithProjects();
    else _queryWithoutProjects();
}

exports.getOne = async (req, res) => {

    let [user, projId] = [req.user, req.params.id];
    
    let err, exisitingProject;

    [err, exisitingProject] = await to(Project.findById(projId).populate([{
        path:'Modules',
        populate:[
            {
                path:'module',
                select:['name'],
                model:'Module'
            },{
                path:'TL',
                select:['userName'],
                model:'User'
            },{
                path:'developers',
                select:['userName', 'gender', 'email'],
                model:'User'
            }
        ]
    },{
        path:'department',
        model:'Department'
    }]));

    if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!exisitingProject) { return ReE(res, {message:'Project doesn\'t found!'}, BAD_REQUEST) }

    return ReS(res, {message:'Project Found!', Project:exisitingProject}, OK);

}

exports.addModule = async (req, res) => {

    let [user, ReQ] = [req.user, req.body];

    let err, exisitingProject, exisitingModule, saveProject;

    [err, exisitingProject] = await to(Project.findById(ReQ.id)); 

    if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!exisitingProject) { return ReE(res, {message:'Project doesn\'t found!'}, BAD_REQUEST) }
    
    [err, exisitingModule] = await to(Module.findById(ReQ.module));

    if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!exisitingModule) { return ReE(res, {message:'Module doesn\'t found!'}, BAD_REQUEST) };

    let exisitSavedModule = exisitingProject.Modules.find(s => s.module.equals(exisitingModule._id));

    if(exisitSavedModule) { return ReE(res, {message:'Module already here!'}, BAD_REQUEST) }

    let addModule = {module: exisitingModule._id, TL:user._id};

    exisitingProject.Modules.push(addModule);

    [err, saveProject] = await to(exisitingProject.save());

    if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!saveProject){ return ReE(res, {message:'Module doesn\'t added this project'}, BAD_REQUEST) }

    return ReS(res, {message:'Module Added successfully', Project:{module:exisitingModule, TL:req.user}}, OK)

}

exports.addDeveloper = async (req, res) => {

    let [user, ReQ] = [req.user, req.body];

    let err,dev, exisitingProject, exisitingModule, saveProject;

    [err, dev] = await to(User.findById(ReQ.dev));

    if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!dev) { return ReE(res, {message:'Developer doesn\'t found!'}, BAD_REQUEST) }

    [err, exisitingProject] = await to(Project.findById(ReQ.id));

    if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!exisitingProject) { return ReE(res, {message:'Project doesn\'t found!'}, BAD_REQUEST) }
    
    [err, exisitingModule] = await to(Module.findById(ReQ.module));

    if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!exisitingModule) { return ReE(res, {message:'Module doesn\'t found!'}, BAD_REQUEST) };

    let exisitSavedModule = exisitingProject.Modules.find(s => s.module.equals(exisitingModule._id));

    if(!exisitSavedModule) { return ReE(res, {message:'Module not here!'}, BAD_REQUEST) }

    exisitSavedModule.developers.push(dev._id);

    [err, saveProject] = await to(exisitingProject.save());

    if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!saveProject){ return ReE(res, {message:'Module doesn\'t added this project'}, BAD_REQUEST) }

    return ReS(res, {message:'Module Added successfully', Dev:{_id:dev._id, userName:dev.userName, email:dev.email, gender:dev.gender}}, OK)

}

exports.getModule = async (req, res) => {

    let [user, ReQ] = [req.user, req.query];

    let err, exisitingProject;

    [err, exisitingProject] = await to(Project.findById(ReQ.projectId).populate([{
        path:'Modules',
        populate:[
            {
                path:'module',
                select:['name'],
                model:'Module'
            },{
                path:'TL',
                select:['userName', 'email'],
                model:'User'
            },{
                path:'developers',
                select:['userName', 'gender', 'email'],
                model:'User'
            }
        ]
    },{
        path:'department',
        model:'Department'
    }]));

    if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!exisitingProject) { return ReE(res, {message:'Project doesn\'t found!'}, BAD_REQUEST) };

    let moduleDet = exisitingProject.Modules.find(s => s.module.equals(ReQ.module));

    return ReS(res, {message:'ProjectModule found!', Module:moduleDet, projectName:exisitingProject.Name});

}