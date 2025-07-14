const mongoose=require('mongoose')
const Schema=mongoose.Schema

let jobsch=new  Schema({
    title:{required:true,type:String},
    description:{required:true,type:String},
    location:{required:true,type:String},
    category:{required:true,type:String},
    level:{required:true,type:String},
    salary:{required:true,type:Number},
    visible:{default:true,type:Boolean},
    companyid:{type:Schema.Types.ObjectId,ref:'company',required:true}

})


let job=mongoose.model('job',jobsch)
module.exports=job

