const mongoose=require('mongoose')
const Schema=mongoose.Schema

let jobappsch=new Schema({
    userid:{required:true,type:String},
    companyid:{required:true,type:Schema.Types.ObjectId,ref:'company'},
    jobid:{required:true,type:Schema.Types.ObjectId,ref:'job'},
    status:{default:'Pending',type:String},
})



let jobapplication=mongoose.model('jobaaplication',jobappsch)
module.exports=jobapplication


