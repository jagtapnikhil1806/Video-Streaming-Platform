import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


// Configuration
try{
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_API_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  
})}catch(err){
  console.log("cloudinary configuration error :",err)
}



const uploadFileONCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    })
    fs.unlinkSync(localFilePath)
    return response
  } catch (err) {
    console.log("file upload failed: ", err)
    fs.unlinkSync(localFilePath)
    return null
  }
}

export { uploadFileONCloudinary }
