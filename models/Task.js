const mongoose = require("mongoose");
const Ids = mongoose.Schema.Types.ObjectId;
const  CONFIG = require("../config/config");

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  module: {
    type: Ids,
    ref: "Module",
  },
  Description: {
    type: String,
  },
  Project: {
    type: Ids,
    ref: "Project",
  },
  assignedTo: {
    type: Ids,
    ref: "User",
  },
  status: {
    type: String,
    default: "PENDING",
    enum: CONFIG.TASK_STATUS,
  },
  pickDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
  assignedFrom:{
    type: Ids,
    ref: "User",
  }
});

module.exports = new mongoose.model("Task", TaskSchema);
