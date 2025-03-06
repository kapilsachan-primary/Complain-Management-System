import express from "express";
const router=express.Router();
import { Complain } from '../models/Complain.js';

router.post('/complain',async (req,res)=>{
    try{
        const latesttoken=await Complain.findOne().sort({tokenno: -1});
        const newtokenno=latesttoken?latesttoken.tokenno+1:1;
        const newComplain= new Complain({
            tokenno:newtokenno,
            issuedate: new Date(),
            name: req.body.name,
            roomno: req.body.roomno,
            department:req.body.department,
            contactno: req.body.contactno,
            subject: req.body.subject,
            description: req.body.description,
            priority: req.body.priority,
            status: "N/A",
        })
        await newComplain.save();
        return res.json({status: true,message: "Complain registered Token No. "+newtokenno+" generated"})
    } catch(err){
        return res.json({status: false,message: err.message})
    }
});

export {router as UserRouter}