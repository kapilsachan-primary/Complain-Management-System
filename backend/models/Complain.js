import mongoose from "mongoose";

const ComplainSchema = new mongoose.Schema({
    issuedate:{type:Date, required:true},
    name:{type: String, required: true},
    roomno:{type: String, required: true},
    contactno:{type: Number, required: true},
    subject:{type: String, required: true},
    description:{type: String, required: true},
    priority:{type: String,required: true},
    status:{type: String,required: true},
    action:{type:String, required: false, default:''},
    closuredate:{type: Date,required: false, default:null},
})

const ComplainModel =mongoose.model("Complain",ComplainSchema);

export {ComplainModel as Complain}