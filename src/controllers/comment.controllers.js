import { asyncHandler } from "../utils/asyncHandler.js";
import {Comment} from "../models/comment.models.js"
import {apiError}from "../utils/apiError.js"
import {apiResponse}from "../utils/apiResponse.js"


const getAllComments=asyncHandler(async(req,res)=>{
    const{videoId}=req.params
    if(!videoId){
        throw new apiError(400,"videoId is required")
    }
    const comments= await Comment.aggregate([{$match:{video:new mongoose.Types.ObjectId(videoId)}}])

    if(!comments){
        throw new apiError(400,"Comments not Found")
    }
    
    return res
    .status(200)
    .json(new apiResponse(200,comments[0],"comments fetched Successfullly"))
})

const createComment=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    const {content}=req.body
    if(!videoId){
        throw new apiError(400,"videoId is required")
    }
    if(!content){
        throw new apiError(400,"Content is required")

    }
    
    const comment=await Comment.create({
        content,
        video:videoId,
        owner:req.user?._id

    })

    if(!comment){
        throw new apiError(400,"Comment Not Created")
    }
     
    return res.status(201).json(new apiResponse(201,comment,"comment created successfully"))
    
    
})
const updateComment=asyncHandler(async(req,res)=>{
    const{videoId}=req.params
    const {commentId,content}= req.body

    if(!videoId){
        throw new apiError(400,"VideoID is required")
    }
    if (!commentId || !content){
        throw new apiError(400,"commentId and content are required")
    }
    const comment=await Comment.findByIdAndUpdate(commentId,{content},{new:true})
    if(!comment){
        throw new apiError(400,"Comment not Updated")
    }

    return res.status(200).json(new apiResponse(200,comment,"comment updated successfully"))
})
const deleteComment=asyncHandler(async(req,res)=>{
    const{commentId}=req.body
    if(!commentId){
        throw new apiError(400,"CommentId is required")
    }
    const comment= await Comment.findByIdAndDelete(commentId)

    if(!comment){
        throw new apiError(400,"Enter valid comment Id")
    }

    return res.status(200).json(new apiResponse(200,{},"Comment deleted successfully"))
})


export{getAllComments,
        createComment,
    updateComment,
deleteComment}



