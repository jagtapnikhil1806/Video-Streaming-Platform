import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import{Video} from "../models/video.models.js" 
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

const getChannelStats=asyncHandler(async(req,res)=>{
     // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const{userId}= req.params
    if (!userId){
        throw new apiError(400,"user Id is requires")
    }

    const channelStats= await User.aggregate([{
        $match:{
            _id: new mongoose.Types.ObjectId(userId)
        }
    },{
        $lookup:{
            from:"videos",
            localField:"_id",
            foreignField:"owner",
            as:"videos"
        }
    },{
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"
        }
    },{
        $addFields:{
            videos:{$size:"$videos"},
            subscribers:{$size:"$videos"},
            likes:{$add:"$likes.likes"},
            view:{$add:"$likes.likes"}

        }
    },{
        $project:{
            username:1,
            email:1,
            fullName:1,
            avatar:1,
            coverImage:1,
            videos:1,
            subscribers:1,
            likes:1,
            views:1


            
        }
    }])

    if(!channelStats){
        throw new apiError(400,"Channel doesn't Exist")
    }

    return res.status(200).json(new apiResponse(200,channelStats,"Channel stats fetched successfully"))
    
})

const getChannelVideos=asyncHandler(async(req,res)=>{
    const{userId}=req.params
    if(!userId){
        throw new apiError(400,"User Id is required")
    }
    const videos= await Video.find({owner:userId})
    if(!videos){
        throw new apiError(404,"User videos not found")
    }

    return res.status(200).json(new apiResponse(200,videos,"Channel Videos fetched successfully"))

})

export {getChannelStats,getChannelVideos}