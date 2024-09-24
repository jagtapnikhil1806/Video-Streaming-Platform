import { asyncHandler } from "../utils/asyncHandler.js";
import {Like} from "../models/like.models.js"
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";




const toggleVideoLike=asyncHandler(async(req,res)=>{
     const {videoId}=req.params
    
    
    if(!req.user._id){
        throw new apiError(400,"User not Found")
    }
    const likedVideo= await Like.findOne({
        video: videoId,
        likedBy:req.user?._id
        
    })

    if(likedVideo){
        await Like.findByIdAndDelete(likedVideo._id)
        return res.status(200).json(new apiResponse(200,"","Like removed Successfully"))
        
    }
    const createLikedVideo= await Like.create({
        video:videoId,
        likedBy:req.user?._id
    })

    if(!createLikedVideo){
        throw new apiError(400,"user not found")
    }

    return res.status(200)
    .json(new apiResponse(200,createLikedVideo,"Liked Successfully"))

    
     
   
    
})
const getLikedVideos=asyncHandler(async(req,res)=>{
    if(!req.user._id){
        throw new apiError(400,"User not Found")
    }
    const likedVideos=await Like.find({likedBy:req.user?._id})

    if(!likedVideos){
        throw new apiError(400,"videos not found")
    }
     
    return res
    .status(200)
    .json(new apiResponse(200,likedVideos,"Liked Videos Fetched Successfully"))
})


export {getLikedVideos,
toggleVideoLike,}