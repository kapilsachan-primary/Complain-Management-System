import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {type: String, required: true ,unique:true},
  hasServices: {type: Boolean, required: true},
  services: [String],  // List of services if hasServices is true
});

const CategoryModel = mongoose.model("Category", categorySchema);
export {CategoryModel as Category}