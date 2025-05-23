import express from "express";
import bcrypt from "bcrypt";
const router=express.Router();
import { Coordinator } from "../models/Coordinator.js";
import jwt from 'jsonwebtoken';
import { Technician} from "../models/Technician.js";
import { Complain } from "../models/Complain.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import ExcelJS from "exceljs";
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
    res.cookie('ctoken', token, {httpOnly: true,secure:true, sameSite:'None',maxAge: 7200000, path: '/',})
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
    res.clearCookie('ctoken',{
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/', // Must match original cookie's path
      });
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
        const najobs=await Complain.countDocuments({ status : "Y/A" });
        const pendingjobs=await Complain.countDocuments({ status: "Pending"});
        const resolvedjobs=await Complain.countDocuments({ status: "Resolved"});
        const onholdjobs=await Complain.countDocuments({ status: "OnHold"});
        return res.json({najobs,pendingjobs,resolvedjobs,onholdjobs});
    }catch(err){
        return res.json({status: false,message: err})
    }
});

router.delete('/deleteproduct/:id',async(req,res)=>{
    try{
    const id=req.params.id;
    const deletedproduct=await Product.findByIdAndDelete(id);
    if(!deletedproduct){
        return res.json({Status: false,Message: "Product not deleted"});
    }
    return res.json({Status: true,Message: "Product Deleted"});
    }catch(err){ 
        return res.json({status: false,Message: err.message})
    }
});

router.get('/report', async (req, res) => {
    const { startDate, closeDate } = req.query;
    const start=new Date(startDate);start.setHours(0,0,0,0);
    const end=new Date(closeDate);end.setHours(23,59,59,999);
    try {
        const complaints = await Complain.find({
            issuedate: { $gte: start, $lte: end }
        });

        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Show all the Categories and send them to frontend
router.get('/allcategories',async(req,res)=>{
    try{
        const categories= await Category.find();
        return res.json(categories);
    }
    catch(err){
        return res.json({Status: false,message: "Server error"}) 
    }
    
});
 
//Show all the Products and send them to frontend
router.get('/allproducts',async(req,res)=>{
    try{
        const products= await Product.find();
        const productCategories= await Product.distinct("categoryName");
        return res.json({products:products,productCategories:productCategories});
    }
    catch(err){
        return res.json({Status: false,message: "Server error"}) 
    }
    
});

// Add a new category
router.post("/addcategory", async (req, res) => {
    try {
        const { name, hasServices } = req.body;
        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
          return res.json({Status:false, message: "Category already exists" });
        }
    
        // Create new category
        const newCategory = new Category({
          name,
          hasServices,
          services: hasServices ? [] : undefined, // Initialize empty array if hasServices is true
        });
        await newCategory.save();
        res.json({Status:true, message: "Category added successfully"});
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    
  });

// Add a new service to a category
router.post("/:categoryId/add-service", async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { serviceName } = req.body;
      const category = await Category.findById(categoryId);
      if (!category) return res.json({Status:false, message: "Category not found" });
  
      // If category doesn't support services, enable it
      if (!category.hasServices) {
        category.hasServices = true;
      }

      category.services.push(serviceName);
      await category.save();
  
      res.json({ Status:true,message: "Service added successfully"});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// Add a new product to a category
router.post("/addproduct", async (req, res) => {
    try {
      const { name,categoryName, categoryId, department } = req.body;
  
      const newProduct = new Product({ name,categoryName:categoryName, category: categoryId, department });
      await newProduct.save();
  
      res.json({Status:true, message: "Product added successfully"});
    } catch (error) {
      res.json({Status:false, error: error.message });
    }
  });
  
  router.delete("/deleteCategory/:categoryId",async(req,res) => {
    try{    
    const { categoryId }= req.params;
        //Checking if category exists
        const category = await Category.findById(categoryId);
        if(!category) {
            return res.status(404).json({ message: "Category not found"})
        }
        const deleteProducts=await Product.deleteMany({category: categoryId});
        const deletedCategory=await Category.findByIdAndDelete(categoryId);
        if(!deletedCategory) {
            return res.status(422).json({ message: "Category not deleted"})
        }
        return res.status(200).json({message: "Category and its products are deleted"})
    }catch(error){
        return res.status(500).json({error : error.message});
    }
    })

    // Delete a specific service from a category
router.delete("/:categoryId/remove-service", async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { serviceName } = req.body;
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      //console.log("category Id",categoryId);
      //console.log("serviceName",serviceName);
      // Remove the service from the services array
      category.services = category.services.filter(service => service.trim() !== serviceName.trim());
      // If no services remain, set hasServices to false
      if (category.services.length === 0) {
        category.hasServices = false;
      }
      //console.log("Before save",category.services)
      await category.save();
      //console.log("After save",category.services)
      res.status(200).json({ message: "Service removed successfully"});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post("/bulkproducts", async (req, res) => {
    try {
      const { products } = req.body;
  
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: "No data to insert" });
      }
  
      await Product.insertMany(products);
      res.status(201).json({ message: "Products inserted successfully" });
    } catch (error) {
      console.error("Bulk insert error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.get('/download-template', async (req, res) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const mainSheet = workbook.addWorksheet('Template');
      const hiddenSheet = workbook.addWorksheet('Lists');
      hiddenSheet.state = 'veryHidden'; // Hides the sheet
      mainSheet.columns = [
        { header: 'Departments', key: 'department', width: 25 },
        { header: 'Make - Model No - Dead Stock Number', key: 'details', width: 40 },
      ];
      const headerRow = mainSheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.commit(); // Important to apply changes

      const departments = [
        "applied-mechanics", "artificial-intelligence", "automobile-engineering",
        "biomedical-engineering", "chemical-engineering", "civil-engineering",
        "computer-engineering", "electrical-engineering", "electronics-communication",
        "environment-engineering", "information-technology", "instrumentation-control",
        "mechanical-engineering", "plastic-technology", "robotics-automation",
        "rubber-technology", "science-humanities", "textile-technology", "library", "office"
      ];
  
      // Add the list of departments to the hidden sheet
      departments.forEach((dept, index) => {
        hiddenSheet.getCell(`A${index + 1}`).value = dept;
      });
  
      // Add headers
      //mainSheet.addRow(["Departments", "Make - Model No - Dead Stock No."]);
  
      // Add data validation (dropdown) for 1000 rows
      for (let i = 0; i < 1000; i++) {
        const row = mainSheet.addRow(["", ""]);
        row.getCell(1).dataValidation = {
          type: 'list',
          allowBlank: false,
          formulae: ['Lists!$A$1:$A$20'], // Adjust if your departments list grows
          showErrorMessage: true,
        };
      }
  
      // Set headers for download
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', 'attachment; filename=Template.xlsx');
  
      // Stream the file
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error generating Excel template:', error);
      res.status(500).json({ message: 'Failed to generate the template. Please try again later.' });
    }
  });


export {router as CoordinatorRouter}