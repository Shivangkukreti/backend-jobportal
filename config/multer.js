require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.cloudname,
    api_key: process.env.apikey,
    api_secret: process.env.apisecret,
});

const storage = new CloudinaryStorage({
cloudinary: cloudinary,
params: {
    folder: 'images',
    allowed_formats: ['jpeg', 'png', 'jpg',],
    resource_type: 'image',
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
}});



const storageraw = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'raw',
        allowed_formats:["pdf"], 
         resource_type: 'raw',
        
    }
})

module.exports = { cloudinary, storageraw,storage };


