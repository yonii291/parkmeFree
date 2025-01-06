import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'dhdw2ufxn',
    api_key: '362358354763855',
    api_secret: process.env.CLOUDINARY_SECRET
});

export default cloudinary;