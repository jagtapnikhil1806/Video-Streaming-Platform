import {getAllComments,
    createComment,
updateComment,
deleteComment}from "../controllers/comment.controllers.js"
import {Router} from "express"
import {verifyJWT} from "../middlewares/auth.middlewares.js"


const router=Router()

router.route("/:videoId/comments").get(getAllComments)
router.route("/:videoId/create-comment").post(verifyJWT,createComment)
router.route("/:videoId/update-comment").patch(verifyJWT,updateComment)
router.route("/:videoId/delete-comment").delete(verifyJWT,deleteComment)

export default router