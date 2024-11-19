import {getChannelStats,getChannelVideos}from "../controllers/dashboard.controllers.js"
import { Router } from "express"

const router=Router()

router.route("/:userId/channel").get(getChannelStats)
router.route("/:userId/videos").get(getChannelVideos)

export default router