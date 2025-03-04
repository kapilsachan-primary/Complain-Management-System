import mongoose from "mongoose";

const ComplainSchema = new mongoose.Schema({
    tokenno:{type: Number, unique:true},
    issuedate:{type:Date, required:true},
    name:{type: String, required: true},
    roomno:{type: String, required: true},
    department:{type: String, required: true},
    contactno:{type: Number, required: true},
    subject:{type: String, required: true},
    description:{type: String, required: true},
    priority:{type: String,required: true},
    status:{type: String,required: true},
    technician:{type:String,required: false, default:''},
    technicianno:{type:String,required: false, default:''},
    action:{type:String, required: false, default:''},
    closuredate:{type: Date,required: false, default:null},
})

const ComplainModel =mongoose.model("Complain",ComplainSchema);

export {ComplainModel as Complain}