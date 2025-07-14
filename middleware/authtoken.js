let jwt=require('jsonwebtoken')
let company=require('../models/company.js')


async function authjwt(req,res,next) {
    let token=req.headers.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.json({success:false,message:'not authorized'})
    }
    try {
        let decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.company= await company.findById(decoded.id).select('-password')
        next()
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

module.exports=authjwt