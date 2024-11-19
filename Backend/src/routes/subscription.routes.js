import {toggleSubscription,
    getSubscribedChannels,
    getSubscribers}from "../controllers/subscription.controllers.js"

import { Router } from "express"
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router= Router()

router.route("/:videoId").put(verifyJWT,toggleSubscription)
router.route("/subscribers").get(verifyJWT,getSubscribers)
router.route("/subscribed-channels").get(verifyJWT,getSubscribedChannels)

export default router