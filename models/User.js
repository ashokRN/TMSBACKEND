const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { to, ReE, ReS, isNull, isEmpty, TE } = require("../utils/Util");
const CONFIG = require("../config/config");
const { JWT_ENCRYPTION, JWT_EXPIRATION } = CONFIG;
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
  },
  Desigination: {
    type: String,
  },
  Department: {
    type: String,
  },
  company: {
    type: String,
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  Grops: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "",
    },
  ],
  profilePic: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  createAuth:{
    type:Boolean,
    default:false,
  }
});

UserSchema.pre("save", async function (next) {
  if (isNull(this.password)) {
    return;
  }

  if (this.isModified("password") || this.isNew) {
    let err, salt, hash;
    [err, salt] = await to(bcrypt.genSalt(10));
    if (err) ThrowInLog(err.message);

    [err, hash] = await to(bcrypt.hash(this.password, salt));
    if (err) ThrowInLog(err.message);

    this.password = hash;
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = async function (pw) {
  let err, pass;
  if (!this.password) ThrowError("password not set");
  [err, pass] = await to(bcrypt.compare(pw, this.password));
  if (err) ThrowError(err);

  if (!pass) ThrowError("Email/password did not match. Please try again.");

  return this;
};

UserSchema.methods.getJWT = function () {
  let expiration_time = parseInt(JWT_EXPIRATION);
  return (
    "Bearer " +
    jwt.sign({ user_id: this._id }, JWT_ENCRYPTION, {
      expiresIn: expiration_time,
    })
  );
};

UserSchema.methods.toWeb = function () {
  let json = this.toJSON();
  json.id = this._id; //this is for the front end
  // json.password = undefined
  return json;
};

module.exports = new mongoose.model("User", UserSchema);
