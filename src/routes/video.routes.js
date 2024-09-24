import {
    getAllVideos, getVideoById, updateVideo, deleteVideo, publishAVideo, togglePublishStatus
} from "../controllers/video.controllers.js"

import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middlewares.js"


const router = Router()

router.route("/get-videos/result").get(getAllVideos)

router.route("/:videoId").get(getVideoById)

router.route("/update-video/:videoId").patch(verifyJWT,upload.single("thumbnail") ,updateVideo)
router.route("/delete-video/:videoId").delete(verifyJWT, deleteVideo)
router.route("/publish-video").post(verifyJWT, upload.fields([
    {
        name: "videoFile",
        maxCount: 1,
        
    }, {
        name:"thumbnail",
        maxCount:1
    }
]), publishAVideo)
router.route("/publish-status").patch(verifyJWT, togglePublishStatus)


export default router



