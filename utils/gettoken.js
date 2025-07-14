let jwt=require('jsonwebtoken')
require('dotenv').config()
function gentoken(id) {
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'})
}

module.exports=gentoken