import { apiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"

export const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("bearer ", "")

    if (!token){
        throw new apiError (401,"Unauthorized request")
    }

    const decodeToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodeToken?._id).select(
        "-password -refeshToken")

    if(!user){
        throw new apiError(401,"Invalid Access Token")
    }

    req.user=user
    
    next()
})
