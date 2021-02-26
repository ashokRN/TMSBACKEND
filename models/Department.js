const mongoose = require('mongoose');
const Ids = mongoose.Schema.Types.ObjectId;

const DepartmentSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    
});

module.exports = new mongoose.model('Department', DepartmentSchema);