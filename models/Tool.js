const mongoose = require("mongoose");
const Ids = mongoose.Schema.Types.ObjectId;

const ToolSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  module:{
    type:Ids,
    ref:'Module'
  },
  department:{
    type:Ids,
    ref:'Department'
  },
  developmentUse: {
    type: String,
  },
  Developers: [
    {
      type: Ids,
      ref: "User",
    },
  ],
  VersionIndicators: {
    Version: {
      type: String,
    },
    update: {
      type: Boolean,
      default: false,
    },
  },
  OfficialUrl: {
    type: String,
  },
});

module.exports = new mongoose.model("Tool", ToolSchema);
