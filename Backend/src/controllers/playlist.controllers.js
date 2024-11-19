import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

const createPlaylist=asyncHandler(async(req,res)=>{
    const {name ,description}=  req.body
    if (!name || !description){
        throw new apiError(400,"Name and Description are required")
    }
    const playlist= await Playlist.create({
        name,
        description,
        owner:req.user?._id
    })

    if(!playlist){
        throw new apiError(400,"Playlist not created")
    }

    return res.status(201).json(new apiResponse(201,playlist,"Playlist created successfully"))
   

})
const getPlaylistById=asyncHandler(async(req,res)=>{
    const {playlistId}= req.params
    if(!playlistId){
     throw new apiError(400,"Playlist Id is required")
    }
    const playlist= await Playlist.findById(playlistId)
    if(!playlist){
        throw new apiError(404,"Playlist not found")
    }
    return res.status(200).json(new apiResponse(200,playlist,"Playlist fetched successfully"))

})

const updatePlaylist=asyncHandler(async(req,res)=>{
    const {playlistId}= req.params
    const{name,description}=req.body
    if(!playlistId){
        throw new apiError(400,"Playlist Id is required")
    }
    if(!name || !description){
        throw new apiError(400,"Name and Description are required")
    }
    const updatedPlaylist= await Playlist.findByIdAndUpdate(playlistId,{
        name,
        description
    },{
        new:true
    })

    if(!updatedPlaylist){
        throw new apiError(404,"Playlist not Found ")
    }

    return res.status(200).json(new apiResponse (200,updatedPlaylist,"Playlist updated successfully"))

})
const deletePlaylist=asyncHandler(async(req,res)=>{
    const {playlistId}=req.params
    if(!playlistId){
        throw new apiError(400,"playlist Id is required")
    }
    const playlist= await Playlist.findByIdAndDelete(playlistId)

    if(!playlist){
        throw new apiError(404,"Playlist not Found")
    }

    return res.status(200).json(new apiResponse(200,{},"Playlist deleted successfully"))

})

const addVideoToPlaylist=asyncHandler(async (req,res)=>{
    const {playlistId}= req.params
    const {videoId}= req.body // only one has to selected 

    if (!playlistId){
        throw new apiError(400,"Playlist Id is required ")
    }
    if (!videoId ){
        throw new apiError(400,"Video Id is required")
    }
    const addVideo= await Playlist.findByIdAndUpdate(playlistId,{
        $push:{videos:videoId}
    },{new:true})
    
    if(!addVideo){
        throw new apiError(404,"Playlist not found")
    }

    return res.status(200).json(new apiResponse(200,addVideo,"video added to playlist Successfully"))
})
const removeVideoFromPlaylist=asyncHandler(async (req,res)=>{
    const {playlistId} = req.params
    const {videoId}=req.body
    if (!playlistId){
        throw new apiError(400,"playlist Id is required")
    }
    if (!videoId){
        throw new apiError(400,"video Id is required")
    }

    const playlist= await Playlist.findByIdAndUpdate(playlistId,{
        $pull:{
            videos: new mongoose.Types.ObjectId(videoId)
        }
    },{
        new:true
    })

    if(!playlist){
        throw new apiError(404,"Playlist not found")
    }

    return res.status(200).json(new apiResponse(200,{},"Video removed fron playlist Successfully"))


})
const getUsersAllPlaylist=asyncHandler(async(req,res)=>{
    const {userId}=req.params
    if(!userId){
        throw new apiError(400,"user Id is required")
    }
    const playlists= await Playlist.find({owner:userId})

    if(!playlists){
        throw new apiError(404,"Not Found")

    }

    return res.status(200).json(new apiResponse(200,playlists,"User Playlist fetched Successfully"))


    

})

export {createPlaylist,getPlaylistById,getUsersAllPlaylist,updatePlaylist,deletePlaylist,addVideoToPlaylist,removeVideoFromPlaylist}

