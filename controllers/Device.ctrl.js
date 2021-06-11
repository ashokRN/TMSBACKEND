const { Device } = require("../models");
const { to, ReE, ReS, isNull } = require("../utils/Util");
const {INTERNAL_SERVER_ERROR, BAD_REQUEST, OK} = require('http-status');

exports.check = async (req, res) => {
    

    return ReS(res, {message:'Device API\'s ready to use!' }, OK)

}
exports.create = async (req, res) => {
    let ReQ  = req.body;

    let err, create;

    [err, create] = await to(Device({ name: ReQ.name,Device: ReQ.device, paths : ReQ.paths, sdCard: ReQ.sdCard  }).save());

    if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(!create){ return ReE(res, {message:'Device doesn\'t create, Try again!'}, BAD_REQUEST) }

    return ReS(res, {message:'Device created!', Device:create}, OK)

}

exports.getAll = async (req, res) => {

    let err, exisitingDevice;

    [err, exisitingDevice] = await to(Device.find({}));

    if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

    if(exisitingDevice?.length === 0) { return ReE(res, {message:'Doesn\'t Have any Devices'}, BAD_REQUEST) }

    return ReS(res, {message:'Devices found!', Devices: exisitingDevice}, OK);
}