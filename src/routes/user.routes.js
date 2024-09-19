
import express,{ Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser,changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getUserWatchHistory } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router= Router()


router.route('/register').post(
    upload.fields([
        {
            name:'avatar',
            maxCount:1

        },{
            name:'coverImage',
            maxCount:1
        }
    ]),
    registerUser);

router.route('/login').post(loginUser)

// Secured Routes
router.route('/logout').post(verifyJWT,logoutUser)

router.route('/refresh-token').post(refreshAccessToken)

router.route('/change-password').post(verifyJWT,changeCurrentPassword)

router.route('/get-user').get(verifyJWT,getCurrentUser)
router.route('/update-account').patch(verifyJWT,updateAccountDetails)
router.route('/avatar').patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route('/cover-image').patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
router.route('/channel/:username').get(verifyJWT,getUserChannelProfile)
router.route('/history').get(verifyJWT,getUserWatchHistory)



export default router