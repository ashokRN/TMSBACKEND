const mongoose = require("mongoose");
const Ids = mongoose.Schema.Types.ObjectId;

const ProjectSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  department:{
    type :Ids,
    ref:'Department'
  },
  DevelopmentTools: [
    {
      type: Ids,
      ref: "Tool",
    },
  ],
  Modules: [
    {
      module: {
        type: Ids,
        ref: "Module",
      },
      developers: [
        {
          type: Ids,
          ref: "User",
        },
      ],
      tasks: [
        {
          type: Ids,
          ref: "Task",
        },
      ],
      TL: {
        type: Ids,
        ref: "User",
      },
    },
  ],
  GitUrl: {
    type: String,
    default:'GitUrl Not Provided!'
  },
  Organaizer: {
    type: Ids,
    ref: "User",
  },
});

module.exports = new mongoose.model("Project", ProjectSchema);
