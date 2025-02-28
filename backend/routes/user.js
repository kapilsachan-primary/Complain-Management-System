import express from "express";
const router=express.Router();
import { Complain } from '../models/Complain.js';

router.post('/complain',async (req,res)=>{
    
    const newComplain= new Complain({
        issuedate: new Date(),
        name: req.body.name,
        roomno: req.body.roomno,
        contactno: req.body.contactno,
        subject: req.body.subject,
        description: req.body.description,
        priority: req.body.priority,
        status: "Pending",
    })
    await newComplain.save();
    return res.json({status: true,message: "Complain registered"})
});

export {router as UserRouter}