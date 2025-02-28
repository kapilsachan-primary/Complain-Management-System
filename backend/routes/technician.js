import express from "express";
import bcrypt from "bcrypt";
const router=express.Router();
import { Technician } from "../models/Technician.js";
import jwt from 'jsonwebtoken';
router.post('/register',async (req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const contactno=req.body.contactno;
    const password=req.body.password;
    const technician= await Technician.findOne({email});
    if(technician){
        return res.json({status: false,message: "Technician already exists."});
    }
    const techph= await Technician.findOne({contactno});
    if(techph){
        return res.json({status: false,message: "Technician already exists."});
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
    const token=jwt.sign({name: technician.firstname, id: technician._id}, process.env.KEY , {expiresIn: '2h'})
    res.cookie('ttoken', token, {httpOnly: true,maxAge: 7200000})
    return res.json({status: true, message: "Login Successfull"})
})

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
})
router.get('/logout',(req,res)=>{
    res.clearCookie('ttoken');
    return res.json({Status: "Success"});
})

export {router as TechnicianRouter}