import express from "express";
const router=express.Router();
import { Complain } from '../models/Complain.js';
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
router.post('/complain',async (req,res)=>{
    try{
        const today = new Date();
        const yy = today.getFullYear().toString().slice(-2);
        const mm = (today.getMonth() + 1).toString().padStart(2, '0');
        const dd = (today.getDate()).toString().padStart(2, '0');
        const datePrefix=yy+mm+dd; // Bringing Date in YYMMDD format
        const datePrefixNum=parseInt(datePrefix); // For numerical comparison.
        //Find latest tokenno starting with today's date
        const latestTodayToken=await Complain.findOne({
            tokenno:{
                $gte: datePrefixNum * 1000,
                $lt: (datePrefix+1)*1000
            }
        }).sort({tokenno: -1});
        //Determine new counter
        let counter=1;
        if(latestTodayToken){
            counter=(latestTodayToken.tokenno % 1000) +1;
        }
        const newtokenno=(datePrefixNum*1000)+counter;
        const newComplain= new Complain({
            tokenno:newtokenno,
            issuedate: new Date(),
            name: req.body.name,
            roomno: req.body.roomno,
            department:req.body.department,
            contactno: req.body.contactno,
            category: req.body.category,
            services: req.body.services,
            productdescription: req.body.productdescription,
            status: "Y/A",
        })
        await newComplain.save();
        return res.json({status: true,message: "Complain registered Token No. "+newtokenno+" generated"})
    } catch(err){
        return res.json({status: false,message: err.message})
    }
});

router.get("/categories", async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get products based on department and category
router.get("/products", async (req, res) => {
    try {
      const { department, categoryname } = req.query;
      const products = await Product.find({ department, categoryName: categoryname });
      if(!products)
        return res.json({Status:false,products:products})
      return res.json({Status:true,products:products});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

export {router as UserRouter}