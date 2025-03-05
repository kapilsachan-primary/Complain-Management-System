import express from "express";
import bcrypt from "bcrypt";
const router=express.Router();
import { Admin } from "../models/Admin.js";
import jwt from 'jsonwebtoken';
import { Technician} from "../models/Technician.js";
import { Complain } from "../models/Complain.js";
router.post('/login', async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const admin= await Admin.findOne({email});
    if(!admin){
        return res.json({status: false,message: "Invalid Credentials"})
    }
    const validPassword= await bcrypt.compare(password, admin.password)
    if(!validPassword){
        return res.json({status: false,message: "Invalid Credentials"})
    }
    // if (password !== admin.password) {
    //     return res.json({status: false, message: "Invalid Credentials"});
    // }
    const token=jwt.sign({name: admin.name, id: admin._id}, process.env.KEY , {expiresIn: '2h'})
    res.cookie('atoken', token, {httpOnly: true,maxAge: 7200000})
    return res.json({status: true, message: "Login Successfull"})
})

const verifyadmin = (req,res,next) =>{
    const token=req.cookies.atoken;
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
router.get("/status",verifyadmin,(req,res) =>{
    return res.json({Status: "Success",name: req.name,id: req.id});
})
router.get('/logout',(req,res)=>{
    res.clearCookie('atoken');
    return res.json({Status: "Success"});
})
router.post("/profile",async(req,res)=>{
    try{
    const id=req.body.id;
    const admin= await Admin.findById(id); 
    if(!admin){
        return res.json({status: false,message: "admin Not Found"})
    }  
     return res.json(admin);
    }
    catch(err){
        return res.json({status: false,message: "Server error"})
    }
})
router.put("/editprofile", async(req,res)=>{
    const id=req.body.id;
    const name=req.body.name;
    const contactno=req.body.contactno;const email=req.body.email;
    try{
        const updatedadmin=await Admin.findByIdAndUpdate({_id: id},{name: name,email: email,contactno: contactno},
        { new:true,runValidators:true });
        if(!updatedadmin){
            return res.json({Status: false,message: "Admin Not Found"})       
        }
        return res.json({Status: true,message: "Admin Updated"})
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
        const updatedadmin=await Admin.findByIdAndUpdate({_id: id},{password: hashpass},
        { new:true,runValidators:true });
        if(!updatedadmin){
            return res.json({Status: false,message: "Admin Not Found"})       
        }
        return res.json({Status: true,message: "Admin's Password Updated"})
    }
    catch(err){
        return res.json({Status: false,message: "Server error"})
    }
})

router.post("/details",async(req,res)=>{
    const fetch=req.body.fetch;
    if(fetch==='technician'){
        try{
            const technicians= await Technician.find();
            return res.json(technicians);
        }
        catch(err){
            return res.json({Status: false,message: "Server error"}) 
        }
    }
    if(fetch==='complain'){
        try{
            const complains= await Complain.find();
            return res.json(complains);
        }
        catch(err){
            return res.json({Status: false,message: "Server error"}) 
        }
    }
    if(fetch==='selecttech'){
        try{
            const technicians= await Technician.find({}, 'name contactno');
            return res.json(technicians);
        }
        catch(err){
            return res.json({Status: false,message: "Server error"}) 
        }
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
router.put('/assigntechnician', async (req,res) =>{
    const id=req.body.id;
    const technician=req.body.technician;const technicianno=req.body.technicianno;
    try{
        const updatedcomplain=await Complain.findByIdAndUpdate({_id: id},{technician: technician,technicianno: technicianno},
            { new:true,runValidators:true });
            if(!updatedcomplain){
                return res.json({Status: false,message: "Complaint Not Found"})       
            }
            return res.json({Status: true,message: "Complaint Updated"})
    }catch(err){
        return res.json({Status: false,message: "Server error"})
    }
})
export {router as AdminRouter}