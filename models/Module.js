const mongoose = require('mongoose');
const Ids = mongoose.Schema.Types.ObjectId;

const ModuleSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    department:{
        type:Ids,
        ref:'Department'
    }
});

module.exports = new mongoose.model('Module', ModuleSchema);