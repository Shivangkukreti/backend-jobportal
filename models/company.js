const mongoose=require('mongoose')
const jobapplication = require('./jobapplication')
const Schema=mongoose.Schema

let comsch= new Schema({
     password:{type:String,required:true},
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    image:{type:String,required:true},
})

comsch.post('findOneAndDelete',async(data)=>{
    if (data) {
        await jobapplication.deleteMany({companyid:data.id})
    }
})

let company=mongoose.model('company',comsch)
module.exports=company