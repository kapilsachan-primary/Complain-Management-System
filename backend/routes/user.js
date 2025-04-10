import express from "express";
const router=express.Router();
import { Complain } from '../models/Complain.js';
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { sendEmail } from "../services/EmailService.js";
import { Admin } from "../models/Admin.js";
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
            email:req.body.email,
            contactno: req.body.contactno,
            category: req.body.category,
            services: req.body.services,
            productdescription: req.body.productdescription,
            status: "Y/A",
            remarks:req.body.descriptionRemarks,
        })
        await newComplain.save();
        const complaintData={
            title:"New Complaint Registered",
            tokenno:newtokenno,
            name: req.body.name,
            roomno: req.body.roomno,
            department:req.body.department,
            category: req.body.category,
            services: req.body.services,
            productdescription: req.body.productdescription,
            remarks:req.body.descriptionRemarks,
            status: "Y/A",
            technician:"Yet to be Assigned",
            action:"Yet to be Taken",
        };
         res.status(200).json({ message: "Token No. "+newtokenno+ " generated" });
        // Send emails from the provided sender email
        //try {
        const findAdmin = await Admin.find();
          await sendEmail(process.env.ComplaintRegister_Email, process.env.ComplaintRegister_Pass, req.body.email, "Complaint Registered", complaintData);
          await sendEmail(process.env.ComplaintRegister_Email, process.env.ComplaintRegister_Pass, findAdmin[0].email, "New Complaint Received", complaintData);
          //return res.status(200).json({ message: "Token No. "+newtokenno+ " generated and Emails sent" });

     // } catch (emailError) {
         //return res.status(422).json({ message:  "Token No. "+newtokenno+" generated, but email not sent" });
      //}
    } catch(err){
        return res.status(500).json({message: err.message})
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