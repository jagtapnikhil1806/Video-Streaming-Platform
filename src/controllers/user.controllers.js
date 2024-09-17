import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.models.js"
import { uploadFileONCloudinary } from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"
import {upload }from "../middlewares/multer.middlewares.js"

const registerUser = asyncHandler(async (req, res) => {
  //getting data
  const { username, fullName, email, password } = req.body
  // console.log("req.body :",req.body)

  //checking fields for null
  if (
    [username, fullName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(300, "all Fields are required")
  }
  //checking for user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  })
  if (existingUser) {
    throw new apiError(400, "Email or username already exists")
  }

  //checking media cloudinary upload
  const avatarLocalPath = await  req.files?.avatar[0]?.path;
  // console.log("req files :",req.files)
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
     coverImageLocalPath=req.files.coverImage[0].path;
  }

  if(!avatarLocalPath){
    throw new apiError(400, "avatar is required")
  }

  const avatar = await uploadFileONCloudinary(avatarLocalPath)
  // console.log(avatar)
  const coverImage = await uploadFileONCloudinary(coverImageLocalPath)

  if (!avatar) {
    throw new apiError(400, "avatar field is required")
  }

  const newUser = await User.create({
    username: username.toLowerCase(),
    email,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
    fullName,
  })
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  )
  if (!createdUser) {
    throw new apiError(500, "Something Went wrong please try again ")
  }

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "Registered Successfully"))
})

export { registerUser }
