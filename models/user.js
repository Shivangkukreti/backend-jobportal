const mongoose=require('mongoose')
const Schema=mongoose.Schema


let usersch= new Schema({
    _id:{type:String,required:true},
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    resume:{type:String},
    image:{type:String,required:true},

})

let user=mongoose.model("user",usersch)
module.exports=user
