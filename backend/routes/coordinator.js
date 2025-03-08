import express from "express";
import bcrypt from "bcrypt";
const router=express.Router();
import { Coordinator } from "../models/Coordinator.js";
import jwt from 'jsonwebtoken';
import { Technician} from "../models/Technician.js";
import { Complain } from "../models/Complain.js";
router.post('/login', async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const coordinator= await Coordinator.findOne({email});
    if(!coordinator){
        return res.json({status: false,message: "Invalid Credentials"})
    }
    const validPassword= await bcrypt.compare(password, coordinator.password)
    if(!validPassword){
        return res.json({status: false,message: "Invalid Credentials"})
    }
    // if (password !== coordinator.password) {
    //     return res.json({status: false, message: "Invalid Credentials"});
    // }
    const token=jwt.sign({name: coordinator.name, id: coordinator._id}, process.env.KEY , {expiresIn: '2h'})
    res.cookie('ctoken', token, {httpOnly: true,maxAge: 7200000})
    return res.json({status: true, message: "Login Successfull"})
})

const verifycoordinator = (req,res,next) =>{
    const token=req.cookies.ctoken;
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
router.get("/status",verifycoordinator,(req,res) =>{
    return res.json({Status: "Success",name: req.name,id: req.id});
});

router.get('/logout',(req,res)=>{
    res.clearCookie('ctoken');
    return res.json({Status: "Success"});
});


router.post("/profile",async(req,res)=>{
    try{
    const id=req.body.id;
    const coordinator= await Coordinator.findById(id); 
    if(!coordinator){
        return res.json({status: false,message: "Coordinator Not Found"})
    }  
     return res.json(coordinator);
    }
    catch(err){
        return res.json({status: false,message: "Server error"})
    }
});

router.put("/editprofile", async(req,res)=>{
        const id=req.body.id;
        const name=req.body.name;
        const contactno=req.body.contactno;const email=req.body.email;
        try{ 
        const updatedcoordinator=await Coordinator.findByIdAndUpdate({_id: id},{name: name,email: email,contactno: contactno},
        { new:true,runValidators:true });
        if(!updatedcoordinator){
            return res.json({Status: false,message: "Coordinator Not Found"})       
        }
        return res.json({Status: true,message: "Coordinator Updated"})
    }
    catch(err){
        return res.json({Status: false,message: "Server error"})
    }
});

router.put("/resetpassword", async(req,res)=>{
    const id=req.body.id;
    const password=req.body.password;
    const hashpass= await bcrypt.hash(password, 10);
    try{
        const updatedcoordinator=await Coordinator.findByIdAndUpdate({_id: id},{password: hashpass},
        { new:true,runValidators:true });
        if(!updatedcoordinator){
            return res.json({Status: false,message: "Coordinator Not Found"})       
        }
        return res.json({Status: true,message: "Coordinator's Password Updated"})
    }
    catch(err){
        return res.json({Status: false,message: "Server error"})
    }
});

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
            const complains= await Complain.find().sort({_id: -1});
            return res.json(complains);
        }
        catch(err){
            return res.json({Status: false,message: "Server error"}) 
        }
    }
});

router.get('/countjobs',async(req,res)=>{
    try{
        const najobs=await Complain.countDocuments({ status : "N/A" });
        const pendingjobs=await Complain.countDocuments({ status: "Pending"});
        const resolvedjobs=await Complain.countDocuments({ status: "Resolved"});
        const onholdjobs=await Complain.countDocuments({ status: "OnHold"});
        return res.json({najobs,pendingjobs,resolvedjobs,onholdjobs});
    }catch(err){
        return res.json({status: false,message: err})
    }
});

export {router as CoordinatorRouter}