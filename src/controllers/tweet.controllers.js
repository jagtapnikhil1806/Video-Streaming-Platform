import { User } from "../models/user.models.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {apiResponse} from "../utils/apiResponse.js";
import {Tweet} from "../models/tweet.models.js"
import mongoose from "mongoose"

const getUserTweets = asyncHandler(async (req, res) => {
    const {username} = req.params
    if (!username) {
        throw new apiError(400, "Username is required")
    }
   

const user = await User.findOne({username})
if(!user){
    throw new apiError(400,"User not found")
}
 
const userTweets= await Tweet.find({owner:new mongoose.Types.ObjectId(user._id)})


if(!userTweets){
    throw new apiError(400,"User not found")
}

return res
.status(200)
.json(new apiResponse(200,userTweets,"User tweets fetched successfully"))
})

const createTweet=asyncHandler(async(req,res)=>{
    //username, content,=>req.body 
    //validate user
    //createOne tweet
    //check whether created or not 
    //return res
    

     const {content}=req.body

    if (!content) {
        throw new apiError(400,"all fields are required")
    }

    const user= await User.findById(req.user?._id)

    if(!user){
        throw new apiError(400,"User not found")

    }

    const newTweet= await Tweet.create({
        content,
        owner:req.user._id
    })

    if(!newTweet){
        throw new apiError(500, "Internal Server Error")
    }

    return res
    .status(201)
    .json(new apiResponse(201,newTweet,"Tweet created Successfully"))



   
})

const deleteTweet=asyncHandler(async(req,res)=>{
    
    const {tweetId}=req.params
    if (!tweetId){
        throw new apiError(400, "Tweet not found")
    }

    const deletedTweet= await Tweet.findByIdAndDelete(tweetId)

    if(!deletedTweet){
        throw new apiError(400,"Tweet not found ")
    }
    return res.
    status(200)
    .json(new apiResponse(200,{},"Tweet deleted successfully"))
})

const updateTweetDetails=asyncHandler(async(req,res)=>{
    
    const {tweetId}=req.params
    const {content}=req.body

    if (!tweetId || !content){
        throw new apiResponse(400,"content and tweetId are required")
    }

    const tweet= await Tweet.findByIdAndUpdate(tweetId,{
        content
    },{
        new:true,
        runValidators:true
    })

    if(!tweet){
        throw new apiError("Tweet not Found")
    }

    return res
    .status(200)
    .json(new apiResponse(200,tweet,"tweet updated sucessfully"))


})



export {getUserTweets,
        createTweet,
        deleteTweet,
        updateTweetDetails
}