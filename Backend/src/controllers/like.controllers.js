import { asyncHandler } from "../utils/asyncHandler.js";
import {Like} from "../models/like.models.js"
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";




const toggleVideoLike=asyncHandler(async(req,res)=>{
     const {videoId}=req.params
     if (!videoId){
        throw new apiError(400,"video Id is required")
     }
    
    
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
const toggleCommentLike=asyncHandler(async(req,res)=>{
     const {commentId}=req.params
     if (!commentId){
        throw new apiError(400,"comment Id is required")
     }
    
    
    if(!req.user._id){
        throw new apiError(400,"User not Found")
    }
    const likedComment= await Like.findOne({
        comment: commentId,
        likedBy:req.user?._id
        
    })
        if(likedComment){
        await Like.findByIdAndDelete(likedComment._id)
        return res.status(200).json(new apiResponse(200,"","Like removed Successfully"))
        
    }
    const createLikedComment= await Like.create({
        comment:commentId,
        likedBy:req.user?._id
    })

    if(!createLikedComment){
        throw new apiError(400,"user not found")
    }

    return res.status(200)
    .json(new apiResponse(200,createLikedComment,"Liked Successfully"))
})
const toggleTweetLike=asyncHandler(async(req,res)=>{
     const {tweetId}=req.params
     if (!tweetId){
        throw new apiError(400,"tweet Id is required")
     }
    
    
    if(!req.user?._id){
        throw new apiError(400,"User not Found")
    }
    const likedTweet= await Like.findOne({
        tweet: tweetId,
        likedBy:req.user?._id
        
    })
        if(likedTweet){
        await Like.findByIdAndDelete(likedTweet._id)
        return res.status(200).json(new apiResponse(200,"","Like removed Successfully"))
        
    }
    const createLikedTweet= await Like.create({
        tweet:tweetId,
        likedBy:req.user?._id
    })

    if(!createLikedTweet){
        throw new apiError(400,"user not found")
    }

    return res.status(200)
    .json(new apiResponse(200,createLikedTweet,"Liked Successfully"))
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
toggleVideoLike,
toggleCommentLike,
toggleTweetLike}