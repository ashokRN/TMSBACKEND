const { Tool } = require("../models");
const { to, ReE, ReS, isNull } = require("../utils/Util");
const {INTERNAL_SERVER_ERROR, BAD_REQUEST, OK} = require('http-status');

exports.create = async (req, res) => {
    let [user,ReQ]  = [req.user, req.body];
    let err, exisitingTool, create;

    let fields = ["name", "use", "version", "url", "module", "department"];

    let invalidFields = fields.filter(field => { if (isNull(ReQ[field])) { return true }});

    if (invalidFields.length !== 0) { return ReE( res, { message: `Ennter ${invalidFields}` }, BAD_REQUEST );}

    [err, exisitingTool] = await to(Tool.findOne({name: ReQ.name}));

    if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(exisitingTool){ return ReE(res, {message:'Tool is already here !'}, BAD_REQUEST) }

    [err, create] = await to(Tool({
        name: ReQ.name,
        module:ReQ.module,
        department:ReQ.department,
        developmentUse: ReQ.use,
        image:ReQ.image,
        VersionIndicators:{
            Version: ReQ.version
        },
        OfficialUrl: ReQ.url
    }).save());

    if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!create){ return ReE(res, {message:'Tool doesn\'t create, Try again!'}, BAD_REQUEST) }

    return ReS(res, {message:'Tool created!', Tool:create}, OK)
}

exports.getAll = async (req, res)  => {

    let [user,ReQ]  = [req.user, req.query];

    let err, exisitingTools;

    const _queryWithDepartMentAndModule = async () => {

        [err, exisitingTools] = await to(Tool.find({department: ReQ.department,module: ReQ.module}));

        if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

        if(exisitingTools?.length < 0) { return ReE(res,{message:`Doesn\'t  found any tools for this department and module `}, BAD_REQUEST)}

        return ReS(res, {message:`Tools Found!`, Tools:exisitingTools}, OK);
    }


    const _queryWithDepartMent = async () => {

        [err, exisitingTools] = await to(Tool.find({department: ReQ.department}));

        if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

        if(exisitingTools?.length < 0) { return ReE(res,{message:`Doesn\'t  found any tools for this department`}, BAD_REQUEST)}

        return ReS(res, {message:`Tools Found!`, Tools:exisitingTools}, OK);
    }

    const _queryWithoutTools = async () => {

        [err, exisitingTools] = await to(Tool.find({}));

        if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

        if(exisitingTools?.length < 0) { return ReE(res,{message:`Doesn\'t  found any tools `}, BAD_REQUEST)}

        return ReS(res, {message:`Tools Found!`, Tools:exisitingTools}, OK);
    }


    if(ReQ.department !== "" && ReQ.module === "") _queryWithDepartMent();
    else if(ReQ.department !== "" && ReQ.module !== "") _queryWithDepartMentAndModule();
    else _queryWithoutTools();
}

exports.getAllTools = async (req, res) => {
        let err, exisitingTools;

        [err, exisitingTools] = await to(Tool.find({}));

        if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

        if(exisitingTools?.length === 0) { return ReE(res,{message:`Doesn\'t  found any tools for this department`}, BAD_REQUEST)}

        return ReS(res, {message:`Tools Found!`, Tools:exisitingTools}, OK);
}