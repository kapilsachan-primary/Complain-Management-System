import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();
import { UserRouter } from './routes/user.js';
import { TechnicianRouter } from './routes/technician.js';
const app=express();
app.use(express.json());
app.use(cors({
    origin:["http://localhost:5173"],
    method:["POST","GET"],
    credentials: true
}));
app.use(cookieParser());
app.use('/user', UserRouter);
app.use('/technician', TechnicianRouter);
mongoose.connect('mongodb://127.0.0.1:27017/Complain-Management-System')
app.listen(process.env.PORT,()=>{
    console.log("Server is listening on port 3000.");
})