const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const models = {};
const mongoose = require("mongoose");
const CONFIG = require("../config/config");


if (CONFIG.DB_URI != "") {
  var files = fs
    .readdirSync(__dirname)
    .filter((file) => {
      return (
        file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
      );
    })
    .forEach((file) => {
      var filename = file.split(".")[0];
      var model_name = filename.charAt(0).toUpperCase() + filename.slice(1);
      models[model_name] = require("./" + file);
    });

  mongoose.Promise = global.Promise; //set mongo up to use promises
  const mongo_location = CONFIG.DB_URI;

  mongoose
    .connect(mongo_location, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: false,
    })
    .catch((err) => {
      console.log(`*** Can Not Connect to Mongo Server in Your APP ${CONFIG.APP} `);
      console.log(err);
    });

  let db = mongoose.connection;
  module.exports = db;
  db.once("open", () => {
    console.log(
      `Connected to mongo at MONGODB_URI : ${CONFIG.DB_URI} in Your APP ${CONFIG.APP}`
    );
  });
  db.on("error", (error) => {
    console.log("error", error);
  });
  // End of Mongoose Setup
} else {
  console.log("No Mongo Credentials Given");
}
module.exports = models;
