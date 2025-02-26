import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();
const app=express();
app.use(express.json());
app.use(cors({
    origin:["http://localhost:5173"],
    method:["POST","GET"],
    credentials: true
}));
app.use(cookieParser());
app.listen(process.env.PORT,()=>{
    console.log("Server is listening on port 3000.");
})