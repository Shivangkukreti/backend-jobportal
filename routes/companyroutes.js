const express= require('express')
let router=express.Router()
const multer = require('multer');  
const bcrypt=require('bcrypt') 
const {storage} = require('../config/multer');
const upload = multer({ storage });
const gentoken=require('../utils/gettoken')
const company = require('../models/company');
const job = require('../models/job');
const authjwt=require('../middleware/authtoken.js');
const jobapplication = require('../models/jobapplication.js');
const user = require('../models/user.js');


router.post('/register',upload.single('image'),async(req,res)=>{
    let {name,email,password}=req.body
    let image;
    if(req.file){
        image=req.file.path
    }
    if (!name || !email || !password || !image) {
        return res.json({success:false,message:'missing details'})
    }
    try {
        let any=await company.findOne({email})
        if (any) {
           return  res.json({success:false,message:'already registered'})
        }

        let salt = await bcrypt.genSalt(10)
        let hashpass=await bcrypt.hash(password,salt)
        let newcompany= await company.create({
            name,email,password:hashpass,image
        })

        res.json({success:true,company:{
            _id:newcompany._id,
            name:newcompany.name,
            email:newcompany.email,
            image:newcompany.image,
        },token:gentoken(newcompany._id)
    })

    } catch (error) {
         return res.json({success:false,message:error.message})
    }
})


router.post('/login',async(req,res)=>{
    let {email,password}=req.body
    if (!email || !password) {
         return res.json({success:false,message:'missing data'})
    }
    let any=await company.findOne({email})
    try {
         if (await bcrypt.compare(password,any.password)) {
       res.json({success:true,company:{
            _id:any._id,
            name:any.name,
            email:any.email,
            image:any.image,
        },token:gentoken(any._id)})
    }else{
        return res.json({success:false,message:'invalid cred'})
    }
    } catch (error) {
                return res.json({success:false,message:error.message})

    }
   
})


router.get('/companydata',authjwt,async(req,res)=>{
    try {
        let company=req.company
        res.json({success:true,company})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
})


router.post('/postjob',authjwt,async(req,res)=>{
    let {title,description,location,salary,level,category}=req.body
    let companyid=req.company._id
    try {
        let newjob=new job({title,description,location,salary,level,companyid,category})
        await newjob.save()
        res.json({success:true,message:'job added',newjob})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
   
    
})


router.get('/viewapplicants', authjwt, async (req, res) => {
  try {
    let companyid = req.company._id;

    let all = await jobapplication.find({ companyid }).populate('jobid');
    let enrichedApps = await Promise.all(
      all.map(async (app) => {
        let userinfo = await user.findOne({ _id: app.userid }).select('-password'); // optionally hide password
        return {...app._doc,userinfo};
      })
    );

    res.json({ success: true, all: enrichedApps });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});


router.get('/listjobs',authjwt,async(req,res)=>{
    try {
        let companyid=req.company._id
    let all=await job.find({companyid})

    let jobdata=await Promise.all(all.map(async(job)=>{
        let applicants=await jobapplication.find({jobid:job._id})
        return {...job.toObject(),applicants:applicants.length}
    }))

    res.json({success:true,jobdata})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
    
})


router.post('/changestatus',async(req,res)=>{
    try {
        let {id,status}=req.body
    await jobapplication.findByIdAndUpdate(id,{status})
    res.json({success:true,message:'status changed'})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
    
    
})


router.post('/changevisiblity',authjwt,async(req,res)=>{
    try {
        let {id}=req.body
    let companyid=req.company._id
    let any=await job.findById(id)
    if (companyid==any.companyid.toString()) {
        any.visible=!any.visible
    }
    await any.save()
    res.json({success:true,any,message:'changed'})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
    

})


module.exports=router