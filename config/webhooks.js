const {Webhook}=require('svix')
const user=require('../models/user.js')


module.exports = async function clerkweb() {
    try {
        const whook= new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body),{
            'svix-id':req.headers['svix-id'],
            'svix-timestamp':req.headers['svix-timestamp'],
            'svix-signature':req.headers['svisignature'],
        })

        const {data,type}=req.body

        switch (type) {
            case 'user.created':{
                
            const userData={
                id:data.id,
                email:data.email_addresses[0].email_address,
                name:data.first_name + " " + data.last_name,
                image:data.image_url,
                resume:''

            }
            await user.create(userData)
            res.json({})
                break;}
            
            case 'user.update':{
            
             const userData={
                email:data.email_addresses[0].email_address,
                name:data.first_name + " " + data.last_name,
                image:data.image_url,
                resume:''

            }
            await user.findByIdAndUpdate(data.id,userData)
            res.json({})
                
                break;}

            case 'user.delete':{
                await user.findByIdAndDelete(data.id)
                res.json({})
                break;}
        
            default:{

                break;}
        }

    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:"failed"})
        
    }
}

 