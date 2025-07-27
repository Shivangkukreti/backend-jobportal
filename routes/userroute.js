const express=require('express')
const router=express.Router()
const multer = require('multer');  
const {storageraw,cloudinary} = require('../config/multer');
const uploadraw = multer({ storage :storageraw });
const {clerkMiddleware,requireAuth  }=require('@clerk/express');
const user = require('../models/user');
const jobapplication = require('../models/jobapplication');
const job = require('../models/job');



async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
}




router.get('/',async(req,res)=>{
let userid =  req.auth.userId;

try {
   let myuser=await user.findById(userid)  
   if (!myuser) {
    return res.json({success:false,message:'no such user!'})
   }
   res.json({success:true,myuser})
} catch (error) {
   res.json({success:false,message:error.message}) 
}
 
})


router.post('/apply',async(req,res)=>{
    let {jobid}=req.body
    let userid= req.auth.userId;
    let myuser=await user.findById(userid)
    if (! myuser.resume) {
        return res.json({success:false})
    }
    
    try {
        let isapplied =await jobapplication.find({userid,jobid})
        if (isapplied.length>0) {
            return res.json({success:false,message:'already applied'})
        }
        let jobdata=await job.findById(jobid)
        if (!jobdata) {
             return res.json({success:false,message:'no job data'})
        }

        await jobapplication.create({jobid,userid,companyid:jobdata.companyid})
       res.json({success:true,message:'applied'})
    } catch (error) {
         return res.json({success:false,message:error.message})
    }
})



router.get('/applications',async(req,res)=>{
    try {
         let userid=req.auth.userId
    let app=await jobapplication.find({userid}).populate({path:'companyid',select:'-password'}).populate('jobid')
        
    if (!app) {
        return res.json({success:false,message:'no application'})
    }
    res.json({success:true,app})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
   
})



router.post('/updateresume',uploadraw.single('resume'),async(req,res)=>{
    try {
        let userid=req.auth.userId
    let resume=req.file.path
    let userdata=await user.findByIdAndUpdate(userid,{resume})
    console.log('hi'+userdata);
    
    res.json({success:true,message:'resume uploaded',userdata})
    } catch (error) {
        return res.json({success:false,message:error.message}) 
    }
    
})







module.exports=router