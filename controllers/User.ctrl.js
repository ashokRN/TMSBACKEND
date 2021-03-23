const { User } = require("../models");
const { to, ReE, ReS, isNull } = require("../utils/Util");
const {INTERNAL_SERVER_ERROR, BAD_REQUEST, OK} = require('http-status');

exports.Reg_user = async (req, res) => {
  let Req = req.body;
  let err, exisitingUser, createUser;

  let fields = ["userName", "password", "phone", "email"];

  let invalidFields = fields.filter(field => { if (isNull(Req[field])) { return true }});

  if (invalidFields.length !== 0) { return ReE( res, { message: `Please enter ${invalidFields}` }, BAD_REQUEST );}

  [err, exisitingUser] = await to(User.findOne({ username: Req.userName }));

  if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

  if(exisitingUser){ return ReE(res, {message:'UserName is already here'}, BAD_REQUEST) }

  let newUser = new User({
      userName: Req.userName,
      phone: Req.phone,
      email:Req.email,
      password:Req.password
  });

  [err, createUser] = await to(newUser.save());

  if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

  if(!createUser){ return ReE(res, {message:'UserName doesn\'t create. Try again!'}, BAD_REQUEST) }

  return ReS(res, {message:'User create Success', newUser:createUser}, OK);

};

exports.Login = async (req, res) => {
    let Req = req.body;

    let err, exisitingUser;
  
    let fields = ["userName", "password"];
  
    let invalidFields = fields.filter(field => { if (isNull(Req[field])) { return true }});
  
    if (invalidFields.length !== 0) { return ReE( res, { message: `Please enter ${invalidFields} to login` }, BAD_REQUEST );}
  
    [err, exisitingUser] = await to(User.findOne({ userName: Req.userName }));
  
    if (err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }
  
    if (!exisitingUser) { return ReE( res, { message: "You doesn't have an account contact our tutor" }, BAD_REQUEST ); }
  
    let compare;
  
    [err, compare] = await to(exisitingUser.comparePassword(Req.password));
  
    if (err) return ReE(res, err, INTERNAL_SERVER_ERROR);
  
    if (!compare) {
      return ReE(res, { message: "Invalid password" }, BAD_REQUEST);
    }
  
    if (compare) { return ReS(  res, {
          message: "User logged in ",
          user: {
            _id: exisitingUser._id,
            email: exisitingUser.email,
            phone: exisitingUser.phone,
            userName: exisitingUser.userName,
         }, 
         token: exisitingUser.getJWT(), 
        
        }, OK ) }
};

exports.Get_User = (req, res) => (ReS(res, {message:'User data fetched', user:req.user}, OK));

exports.GetAll = async (req, res) => {

  let [user] = [req.user];

  let err, exisitingUsers;

  [err, exisitingUsers] = await to(User.find({}));

  if(err) { return ReE(res, err, INTERNAL_SERVER_ERROR) }

  if(exisitingUsers.length < 0){ return ReE(res, {message:'Users not found!'}, BAD_REQUEST) }

  return ReS(res, {message:'Users found', Users:exisitingUsers}, OK);

}


exports.addUser = async (req, res) => {
    
  let ReQ = req.body;
  let err, createUser;

  let newUser = new User({
    userName: ReQ.name,
    password:ReQ.name + '@123',
    email:ReQ.email,
    Department: ReQ.department,
    gender:ReQ.gender
  });

  [err, createUser] = await to(newUser.save()); 

  if(err){ return ReE(res, err, INTERNAL_SERVER_ERROR) }

  if(!createUser){ return ReE(res, {message:'UserName doesn\'t create. Try again!'}, BAD_REQUEST) }

  return ReS(res, {message:'User create Success', newUser:createUser}, OK);

}