import {getLikedVideos,
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike} from "../controllers/like.controllers.js"
import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"


const router= Router()

router.route("/:videoId").put(verifyJWT,toggleVideoLike)
router.route("/:commentId").put(verifyJWT,toggleCommentLike)
router.route("/:tweetId").put(verifyJWT,toggleTweetLike)
router.route("/liked-videos").get(verifyJWT,getLikedVideos)


export default router