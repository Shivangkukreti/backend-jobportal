const mongoose=require('mongoose')
const jobapplication = require('./jobapplication')
const Schema=mongoose.Schema


let usersch= new Schema({
    _id:{type:String,required:true},
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    resume:{type:String},
    image:{type:String,required:true},

})

usersch.post('findOneAndDelete',async(data)=>{
    if (data) {
        await jobapplication.deleteMany({userid:data.id})
    }
})

let user=mongoose.model("user",usersch)
module.exports=user
