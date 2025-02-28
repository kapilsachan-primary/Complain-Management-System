import mongoose from "mongoose";

const TechnicianSchema = new mongoose.Schema({
    name:{type: String, required: true},
    email:{type: String, required: true, unique:true},
    contactno:{type: Number, required: true, unique:true},
    password:{type: String, required: true},
})

const TechnicianModel =mongoose.model("Technician",TechnicianSchema);

export {TechnicianModel as Technician}