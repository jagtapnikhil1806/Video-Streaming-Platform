import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {Subscription} from "../models/subscription.models.js"
import {apiResponse} from "../utils/apiResponse.js"


const toggleSubscription=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    if(!videoId){
        throw new apiError(400,"VideoId is required")
    }
    const channel=await  Subscription.find({video:videoId}) 
    if(!channel){
        throw new apiError(400,"Video Doesn't Exist")
    }   
    const subscription= await Subscription.findOne({channel:channel._id,subscriber:req.user?._id})
    if(subscription){
        await Subscription.findByIdAndDelete(subscription._id)
        return res.status(200).json(new apiResponse(200,{},"Subscription removed successfully"))
    }

    const newSubscription= await Subscription.create({
        channel:channel._id,
        subscriber:req.user?._id
      
    })

    if(!newSubscription){
        throw new apiError(400,"Invalid Subscription details")
    }

    return res.status(201).json(new apiResponse(201,newSubscription,"Subscribed Successfully"))

})
const getSubscribers=asyncHandler(async(req,res)=>{
    const {userId}=req.params
    
    const subscribers= await Subscription.aggregate([{
        $match:{
            channel:new mongoose.Types.ObjectId(userId)
        }
    },{
       $facet:{
        totalSubscribers:{$count:"count"},
        results:[{$skip:20},{$limit:20}]
       }
        }
    ])

    if(!subscribers){
        throw new apiError(400,"Enter Valid UserId")
    }

    return res.status(200).json(new apiResponse(200,subscribers,"Subscribers Fetched Successfully"))
    
})


const getSubscribedChannels=asyncHandler(async(req,res)=>{
    
    const channel=await Subscription.aggregate([
        {$match:{
            subscriber:new mongoose.Types.ObjectId(req.user?._id)
        }}
        
    ])
    
    if(!channel){
        throw new apiError(400,"User  not found")
    }

    return res.status(200).json(new apiResponse(200,channel,"Subscribed channels fetched successfully"))
})

export{
    toggleSubscription,
    getSubscribedChannels,
    getSubscribers
}