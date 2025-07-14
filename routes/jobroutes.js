const express=require('express')
let job=require('../models/job')
let router=express.Router()


router.get('/',async(req,res)=>{
try {
    let all=await job.find({visible:true}).populate({path:'companyid',select:'-password'})
    res.json({success:true,all})
} catch (error) {
    return res.json({success:false,message:error.message})
}
})

router.get('/:id',async(req,res)=>{
    let {id}=req.params
try {

    let any=await job.findById(id).populate({path:'companyid',select:'-password'})
    if (!any) {
        return res.json({success:false,message:'no job found'})
    }
    res.json({success:true,any})
} catch (error) {
    return res.json({success:false,message:error.message})
}
})


module.exports=router