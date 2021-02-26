const mongoose = require("mongoose");
const Ids = mongoose.Schema.Types.ObjectId;
const { TASK_STATUS } = require("../config/Config");

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
    default: "NOT ASSIGN",
    enum: TASK_STATUS,
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
