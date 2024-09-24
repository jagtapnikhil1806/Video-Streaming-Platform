import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileONCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { uploadedTime } from "../utils/uploadedtime.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";




const getAllVideos = asyncHandler(async (req, res) => {
    const { userId, query, page = 1, limit = 10, sortBy, sortType } = req.query

    const sortOrder = 1; //ascending
    if (sortType == false) {
        sortOrder = -1
    }

   

    const videos = await Video.aggregate([
        {
            $match: {
                title: { $regex: new RegExp(query).toString(), $options: 'i' }
            }
        },{$addFields:{
            sortField: `$${sortBy}`
        }}, {
            $sort: {sortField:sortOrder}

        }


    ])

    if (!videos) {
        throw new apiError("videos not found ")
    }
    return res.status(200)
        .json(new apiResponse(200, videos, "User Videos Fetched Successfully"))
})
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    if (!title || !description) {
        throw new apiError(400, "title and description are required")
    }
    const videoFilePath = req.files?.videoFile[0]?.path
    if (!videoFilePath) {
        throw new apiError(400, "video file is required")
    }

    const thumbnailPath = req.files?.thumbnail[0]?.path
    if (!thumbnailPath) {
        throw new apiError(400, "thumbnail is required")
    }

    const videoFile = await uploadFileONCloudinary(videoFilePath)
    if (!videoFile) {
        throw new apiError(400, "Video File not Uploaded on Cloudinary")
    }
    const thumbnail = await uploadFileONCloudinary(thumbnailPath)
    if (!thumbnail) {
        throw new apiError(400, "Thumbnail not Uploaded on Cloudinary")
    }

    const uploadVideo = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        owner: req.user?._id,
        title,
        description,
        duration: videoFile.duration,
        isPublished: true,
    })

    if (!uploadVideo) {
        throw new apiError(400, "Something Went Wrong ! video not Published!")
    }

    return res.status(201)
        .json(new apiResponse(201, uploadVideo, "Video Published Successfully"))


})
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    //comment pagination is remaining
    if (!videoId) {
        throw new apiError(400, "Video not Found")
    }

    
    const videoDetails = await Video.findById(videoId)
    if (!videoDetails) {
        throw new apiError(400, "video not found")
    }
    const uploadtime= await uploadedTime(Video,videoId)
     await videoDetails.incrementView(videoId)
    const video = await Video.aggregate([{ $match: { _id: new mongoose.Types.ObjectId(videoId) } }, {
        $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "video",
            as: "likes"
        }
    }, {
        $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "video",
            as: "comments"


        }
    }, {
        $addFields: {
            uploadtime,
            likes: { $size: "$likes" }
        }
    }

        , {
        $project: {
            _id: 1,
            videoFile: 1,
            thumbnail: 1,
            title: 1,
            description: 1,
            likes: 1,
            comments: 1,
            duration: 1,
            views: 1,
            isPublished: 1,
            uploadtime:1


        }
    }
    ])



    if (!video || video.length == 0) {
        throw new apiError(400, "Video Doesn't Exist")
    }
    return res.status(200)
        .json(new apiResponse(200, video, "Video fetched Successfully"))

})



const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body

    if (!title || !description) {
        throw new apiError(400, "title and description are required")
    }
    console.log(req.file)
    const thumbnailLocalPath = req.file?.path
    if (!thumbnailLocalPath) {
        throw new apiError(400, "thumbnail is required")
    }

    const thumbnail = await uploadFileONCloudinary(thumbnailLocalPath)

    if (!thumbnail) {
        throw new apiError(400, "thumbnail not uploaded on cloudinary")
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, {
        title,
        description,
        thumbnail: thumbnail.url
    }, {
        new: true
    })

    if (!updatedVideo) {
        throw new apiError(400, "Video not Found")
    }

    return res.status(200)
        .json(new apiResponse(200, updatedVideo, "Video details updated Successfully"))
})
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const deletedVideo = await Video.findByIdAndDelete(videoId)

    if (!deletedVideo) {
        throw new apiError(400, "Video not Found")
    }

    return res.status(200)
        .json(new apiResponse(200, "", "Video Deleted Successfully"))

})
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const { isPublished } = req.body
    if (!isPublished) {
        throw new apiError(400, "isPublished field is required")
    }

    const toggleStatus = await Video.findByIdAndUpdate(videoId,
        {
            isPublished

        },
        {
            new: true
        })

    if (!toggleStatus) {
        throw new apiError(400, "Video not found")
    }

    return res.status(200)
        .json(new apiResponse(200, toggleStatus, "Publish status changed successfully"))

})




export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus

}
