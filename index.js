require('./config/instrument.js')
const Sentry = require("@sentry/node");
const express= require('express')
const app =express()
const cors=require('cors')
require('dotenv').config()
const {clerkMiddleware}=require('@clerk/express')
const clerkweb =require('./config/webhooks.js')
const companyroutes=require('./routes/companyroutes.js')
const jobroutes=require('./routes/jobroutes.js')
const userroutes=require('./routes/userroute.js')

const  mongoose=require('mongoose')
const uri=process.env.MONGO_URL
const PORT=process.env.PORT || 5000
main().then(()=>{
    console.log('done');
}).catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(uri);

}

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())
app.use(express.urlencoded({ extended: true }));


app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}/`);
    
})




app.get('/',(req,res)=>{
    res.send('working')
})

app.post("/webhooks", clerkweb);

app.use('/api/company',companyroutes)
app.use('/api/jobs',jobroutes)
app.use('/api/user',userroutes)







app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});


Sentry.setupExpressErrorHandler(app);