import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
dotenv.config();
import { UserRouter } from './routes/user.js';
import { TechnicianRouter } from './routes/technician.js';
import { AdminRouter } from './routes/admin.js';
import { CoordinatorRouter } from './routes/coordinator.js';
const app=express();
app.use(express.json());
app.use(cors({
    origin:process.env.Frontend_URL,
    method:["POST","GET"],
    credentials: true
}));
app.use(cookieParser());
const __dirname = path.resolve();
mongoose.connect(process.env.MONGODB_URL)
.then(()=> console.log("Mongo DB Connected"))
.catch((err) => console.log("Error connecting DB",err));
app.use('/user', UserRouter);
app.use('/technician', TechnicianRouter);
app.use('/admin', AdminRouter);
app.use('/coordinator',CoordinatorRouter);
//mongoose.connect('mongodb://127.0.0.1:27017/Complain-Management-System')

//Serving the frontend files 
app.use(express.static(path.join(__dirname, 'frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
});


app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is listening on port 3000.");
})