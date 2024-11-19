import {createPlaylist,getPlaylistById,getUsersAllPlaylist,updatePlaylist,deletePlaylist,addVideoToPlaylist,removeVideoFromPlaylist}from "../controllers/playlist.controllers.js"

import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"



const router= Router()


//check for owner details in all routes 
router.route("/create-playlist").post(verifyJWT,createPlaylist)
router.route("/:playlistId").get(getPlaylistById)//owner details
router.route("/:userId/playlists").get(getUsersAllPlaylist)
router.route("/update-playlist/:playlistId").patch(verifyJWT,updatePlaylist)
router.route("/delete-playlist/:playlistId").delete(verifyJWT,deletePlaylist)
router.route("/:playlistId/add-video").patch(verifyJWT,addVideoToPlaylist)
router.route("/:playlistId/remove-video").patch(verifyJWT,removeVideoFromPlaylist)


export default router