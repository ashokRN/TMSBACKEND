const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  Device: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  paths: [
    {
      type: String,
      require: true,
    },
  ],
  sdCard: {
    type: Boolean,
    default: false,
  },
});

module.exports = new mongoose.model("Device", DeviceSchema);
