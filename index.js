require('./config/instrument.js')
const Sentry = require("@sentry/node");
const express= require('express')
const app =express()
const cors=require('cors')
require('dotenv').config()
const clerkweb =require('./config/webhooks.js')
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


app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}/`);
    
})




app.get('/',(req,res)=>{
    res.send('working')
})

app.post("/webhooks", clerkweb);



app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});


Sentry.setupExpressErrorHandler(app);