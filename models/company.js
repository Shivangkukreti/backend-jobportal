const mongoose=require('mongoose')
const Schema=mongoose.Schema

let comsch= new Schema({
     password:{type:String,required:true},
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    image:{type:String,required:true},
})

let company=mongoose.model('company',comsch)
module.exports=company