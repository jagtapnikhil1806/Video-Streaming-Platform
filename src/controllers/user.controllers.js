import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.models.js"
import { uploadFileONCloudinary } from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const genearateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new apiError(
      500,
      "Error occurred during generation of access and refesh token"
    )
  }
}

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
  const avatarLocalPath = await req.files?.avatar[0]?.path
  // console.log("req files :",req.files)
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path
  }

  if (!avatarLocalPath) {
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
  // console.log(newUser)
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  )
  if (!createdUser) {
    throw new apiError(500, "Something Went wrong please try again ")
  }

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User Registered Successfully"))
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body

  if (!email && !username) {
    throw new apiError(400, "username or email required")
  }
  const user = await User.findOne({
    $or: [{ email }, { username }],
  })

  if (!user) {
    throw new apiError(404, "User do not exists")
  }

  const checkPassword = await user.isPasswordCorrect(password)
  if (!checkPassword) {
    throw new apiError(401, "Invalid credentials")
  }

  const { accessToken, refreshToken } = await genearateAccessAndRefreshToken(
    user._id
  )

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in Successfully"
      )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: "" },
    },
    {
      new: true,
    }
  )
  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User Logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookie?.refreshToken || req.body.refeshToken

    if (!incomingRefreshToken) {
      throw new apiError(400, "Invalid Refresh Token")
    }
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new apiError(400, "Invalid Refresh token")
    }

    if (incomingRefreshToken !== user.refeshToken) {
      throw new apiError(400, "refresh Token expired or used")
    }

    const { accessToken, refreshToken } = await genearateAccessAndRefreshToken(
      user._id
    )

    const options = {
      httpOnly: true,
      secure: true,
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      )
  } catch (error) {
    throw new apiError(400, error?.message || "Invalid refresh token")
  }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confPassword } = req.body

  if (newPassword !== confPassword) {
    throw new apiError(400, "Please Enter same Password ")
  }
  const user = await User.findById(req.user?._id)

  const checkPassword = await user.isPasswordCorrect(oldPassword)
  if (!checkPassword) {
    throw new apiError(400, "Please Enter valid Password ")
  }
  user.password = newPassword
  await user.save({ validateBeforeSave: false })
  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password Changed Successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.send(200).json(200, req.user, "User fetched Successfully")
})

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body
  if (!fullName && !email) {
    throw new apiError(400, "fullName and email fields are required")
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName, // fullName:fullName ?? es6 syntax use
        email,
      },
    },
    {
      new: true,
    }
  ).select("-password")

  return res
    .status(200)
    .json(new apiResponse(200, user, "fullName and email Updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path
  if (!avatarLocalPath) {
    throw new apiError(400, "avatar file is Required")
  }
  const avatar = await uploadFileONCloudinary(avatarLocalPath)
  if (!avatar) {
    throw new apiError(400, "avatar file is Required")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password")

  if (!user) {
    throw new apiError(400, "User avatar not updated")
  }

  return res.status(200).json(200, user, "User avatar updated successfully")
})
const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path
  if (!coverImageLocalPath) {
    throw new apiError(400, "avatar file is Required")
  }
  //check it if not updating after debugging change it as model
  const newCoverImage = await uploadFileONCloudinary(coverImageLocalPath)
  if (!newCoverImage) {
    throw new apiError(400, "Cover image file is Required")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: newCoverImage.url,
      },
    },
    { new: true }
  ).select("-password")

  if (!user) {
    throw new apiError(400, "User Cover image not updated")
  }

  return res
    .status(200)
    .json(200, user, "User Cover image updated successfully")
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params
  if (!username?.trim()) {
    throw new apiError(400, "Username is required")
  }

  const user = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase(),
      },
      
    },
    {$lookup:{
      from:"subscriptions",
      localField:"_id",
      foreignField:"channel",
      as:"subscribers"
      
    }},
    {
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"subscriber",
        as:"subscribedTo"
      }
    },
    {
      $addFields:{
        totalSubscribers:{$size:"$subscribers"},
        subscribedToChannels:{$size:"$subscribedTo"},
        isSubscribed:{
          $cond:{
            if:{$in:[req.user._id,"$subscribers.subscriber"]},
            then:true,
            else:false
          }
        }
        
        
      }
    },
    {
      $project:{
        fullName:1,
        username:1,
        email:1,
        totalSubscribers:1,
        subscribedToChannels:1,
        avatar:1,
        coverImage:1
}
    }
  ])

  if(!Channel?.length){
    throw new apiError(400,"Channel not found")
  }

  return res
  .send(200)
  .json(new apiResponse(200,user[0],"User Fetched Successfully"))
})
const getUserWatchHistory = asyncHandler(async (req, res) => {

  const user=await User.aggregate([
    {$match:{
      _id:mongoose.Schema.ObjectId(req.user?._id)
    }},{
      $lookup:{
        from:"videos",
        localField:"watchHistory",
        foreignField:"_id",
        as:"watchHistory",
        pipeline:[{
          $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"owner",
            pipeline:[
              {
                $project:{
                  username:1,
                  fullName:1,
                  avatar:1
                }
              },
              {
                $addFields:{
                  owner:{
                    $first:"$owner"
                  }
                }
              }
            ]

          }}
        ]
      }
    }
  ])
  return res
  .status(200)
  .json(200,user[0].watchHistory,"watchHistory fetched successfully")
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getUserWatchHistory
}
