import mongoose from "mongoose";

const CoordinatorSchema = new mongoose.Schema({
    name:{type: String, required: true, unique:true},
    email:{type: String, required: true, unique:true},
    contactno:{type: Number, required: true, unique:true},
    password:{type: String, required: true},
})

const CoordinatorModel =mongoose.model("Coordinator",CoordinatorSchema);

export {CoordinatorModel as Coordinator}