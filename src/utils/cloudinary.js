import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'





    // Configuration
    
    
const uploadFileONCloudinary=async(localFilePath)=>{
    try{
        cloudinary.config({ 
            cloud_name:process.env.CLOUDINARY_API_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET 
        });
        
        if(!localFilePath)  return null;
        const response= await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto",
        })
        fs.unlinkSync(localFilePath)
        return response;
    }catch(err){
        console.log("file upload failed")
        fs.unlinkSync(localFilePath)
        return null; 
            
    }

}



   export{uploadFileONCloudinary}