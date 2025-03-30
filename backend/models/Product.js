import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {type: String, required: true},
  categoryName:{type:String, required: true},
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  department: String,  // Each product belongs to a specific department
});

const ProductModel = mongoose.model("Product", productSchema);
export {ProductModel as Product};