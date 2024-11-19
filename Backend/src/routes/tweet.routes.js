import {getUserTweets,
        createTweet,
        updateTweetDetails,
        deleteTweet} 
    from "../controllers/tweet.controllers.js"

import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const router=Router()

router.route('/:username').get(getUserTweets)

//secured Routes

router.route('/create-tweet').post(verifyJWT,createTweet)
router.route('/update-tweet/:tweetId').patch(verifyJWT,updateTweetDetails)
router.route('/delete-tweet/:tweetId').delete(verifyJWT,deleteTweet)



export default router;





