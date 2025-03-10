import express from "express";
import bcrypt from "bcrypt";
const router=express.Router();
import { Technician } from "../models/Technician.js";
import { Complain } from "../models/Complain.js";
import jwt from 'jsonwebtoken';

router.post('/register',async (req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const contactno=req.body.contactno;
    const password=req.body.password;
    const techname= await Technician.findOne({name});
    if(techname){
        return res.json({status: false,message: "Username already exists."});
    }
    const technician= await Technician.findOne({email});
    if(technician){
        return res.json({status: false,message: "Email already exists."});
    }
    const techph= await Technician.findOne({contactno});
    if(techph){
        return res.json({status: false,message: "Contact No. already exists."});
    } 
    const hashpass= await bcrypt.hash(password, 10)
    const newTechnician= new Technician({
        name: req.body.name,
        email: req.body.email,
        contactno: req.body.contactno,
        password: hashpass,
    })
    await newTechnician.save();
    return res.json({status: true,message: "Technician registered"})
});

router.post('/login', async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const technician= await Technician.findOne({email});
    if(!technician){
        return res.json({status: false,message: "Invalid Credentials"})
    }
    const validPassword= await bcrypt.compare(password, technician.password)
    if(!validPassword){
        return res.json({status: false,message: "Invalid Credentials"})
    }
    const token=jwt.sign({name: technician.name, id: technician._id}, process.env.KEY , {expiresIn: '2h'})
    res.cookie('ttoken', token, {httpOnly: true,maxAge: 7200000})
    return res.json({status: true, message: "Login Successfull"})
});

const verifytechnician = (req,res,next) =>{
    const token=req.cookies.ttoken;
    if(!token){
        return res.json({status: false,Message: "We need token."})
    }
    else{
       jwt.verify(token, process.env.KEY, (err, decoded) => {
            if (err) {
                return res.json({ status: false, Message: "Authentication failed." });
            }
            else {
                req.name = decoded.name;
                req.id = decoded.id;
                next();
            }
        })
    }
}
router.get("/status",verifytechnician,(req,res) =>{
    return res.json({Status: "Success",name: req.name,id: req.id});
});

router.get('/logout',(req,res)=>{
    res.clearCookie('ttoken');
    return res.json({Status: "Success"});
});

router.post("/profile",async(req,res)=>{
    try{
    const id=req.body.id;
    const technician= await Technician.findById(id); 
    if(!technician){
        return res.json({status: false,message: "Technician Not Found"})
    }  
     return res.json(technician);
    }
    catch(err){
        return res.json({status: false,message: "Server error"})
    }
});

router.put("/editprofile", async(req,res)=>{
    const id=req.body.id; const n=req.body.name;
    const name=n.charAt(0).toUpperCase()+n.slice(1).toLowerCase(); const oldname=req.body.oldname;
    const contactno=req.body.contactno;const email=req.body.email;
    try{
        const updatecomplains= await Complain.updateMany(
            {technicianid: id, status:{$in :["Pending","OnHold"]}},{$set:{ technician: name,technicianno: contactno}}
        );
        const updatedtechnician=await Technician.findByIdAndUpdate({_id: id},{name: name,email: email,contactno: contactno},
        { new:true,runValidators:true });
        if(!updatedtechnician){
            return res.json({Status: false,message: "Technician Not Found"})       
        }
        return res.json({Status: true,message: "Technician Updated"})
    }
    catch(err){
        return res.json({Status: false,message: "Server error"})
    }
})

router.put("/resetpassword", async(req,res)=>{
    const id=req.body.id;
    const password=req.body.password;
    const hashpass= await bcrypt.hash(password, 10);
    try{
        const updatedtechnician=await Technician.findByIdAndUpdate({_id: id},{password: hashpass},
        { new:true,runValidators:true });
        if(!updatedtechnician){
            return res.json({Status: false,message: "Technician Not Found"})       
        }
        return res.json({Status: true,message: "Password Updated"})
    }
    catch(err){
        return res.json({Status: false,message: "Server error"})
    }
})

router.post("/fetchjobs",async(req,res)=>{
    const id=req.body.id;
        try{
            const complains= await Complain.find({ technicianid : id }).sort({_id: -1});
            return res.json(complains);
        }
        catch(err){
            return res.json({Status: false,message: "Server error"}) 
        }
});

router.get('/complains/:id', async (req, res) => {
    try {
        const complaint = await Complain.findById(req.params.id);
        if (!complaint) return res.status(404).json({ error: "Complaint not found" });
        res.json(complaint);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/updateactionresolved', async (req,res) =>{
    const id=req.body.id;
    const status=req.body.status;const action=req.body.action;
    try{
        const updatedcomplain=await Complain.findByIdAndUpdate({_id: id},{status: status,action: action,closuredate:new Date()},
            { new:true,runValidators:true });
            if(!updatedcomplain){
                return res.json({Status: false,message: "Complaint Not Found"})       
            }
            return res.json({Status: true,message: "Complaint Updated"})
    }catch(err){
        return res.json({Status: false,message: "Server error"})
    }
});

router.put('/updateactionpending', async (req,res) =>{
    const id=req.body.id;
    const status=req.body.status;const action=req.body.action;
    try{
        const updatedcomplain=await Complain.findByIdAndUpdate({_id: id},{status: "Pending",action: action},
            { new:true,runValidators:true });
            if(!updatedcomplain){
                return res.json({Status: false,message: "Complaint Not Found"})       
            }
            return res.json({Status: true,message: "Complaint Updated"})
    }catch(err){
        return res.json({Status: false,message: "Server error"})
    }
});

router.put('/forward2admin', async (req,res) =>{
    const id=req.body.id;
    const action=req.body.action;
    try{
        const updatedcomplain=await Complain.findByIdAndUpdate({_id: id},{status: "OnHold",action: action},
            { new:true,runValidators:true });
            if(!updatedcomplain){
                return res.json({Status: false,message: "Complaint Not Found"})       
            }
            return res.json({Status: true,message: "Complaint Updated"})
    }catch(err){
        return res.json({Status: false,message: "Server error"})
    }
});

router.get('/countjobs/:name',async(req,res)=>{
    try{
        const name=req.params.name;
        const pendingjobs=await Complain.countDocuments({ status: "Pending",technician:name});
        const resolvedjobs=await Complain.countDocuments({ status: "Resolved",technician:name});
        const onholdjobs=await Complain.countDocuments({ status: "OnHold",technician:name});
        return res.json({pendingjobs,resolvedjobs,onholdjobs});
    }catch(err){
        return res.json({status: false,message: err})
    }
});

router.put("/clearstatus", async(req,res)=>{
    const id=req.body.id;
    try{
        const updatedcomplains= await Complain.updateMany(
            {technicianid: id, status:{$in :["Pending","OnHold"]}},{$set:{technicianid:"" ,technician:"",technicianno:"",status:"N/A"}}
        ); 
        if(!updatedcomplains){
            return res.json({Status: false,message: "Technician's Complain not Updated"})       
        }
        return res.json({Status: true,message: "Complains Updated"})
    }
    catch(err){
        return res.json({Status: false,message: "Server error"})
    }
});

router.delete('/deletetechnician/:id',async(req,res)=>{
    try{
    const id=req.params.id;
    const deletedtechnician=await Technician.findByIdAndDelete(id);
    if(!deletedtechnician){
        return res.json({Status: false,Message: "Technician not deleted"});
    }
    return res.json({Status: true,Message: "Technician Deleted"});
    }catch(err){ 
        return res.json({status: false,Message: "Differenrt error"})
    }
})
export {router as TechnicianRouter}