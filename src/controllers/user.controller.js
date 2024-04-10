import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import mongoose from "mongoose"
// import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import sendWelcomeEmail from "./email.controller.js"

const registerUser = asyncHandler(async(req, res) => {
    const { name, email, username, password } = req.body
    console.log("email", email, "username", username, "name", name, "password", password);
    console.log("running")

    if (
        [username, name, email, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "all feilds is required");
    }
    // console.log("text 1")

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]      //  $or means here "Operators" like || && these type and can use use multiple
    })

    // console.log("text 2")

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // console.log("text 3")

    // console.log(req.files);

    // // console.log("test 3.1");
    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // // console.log("text 4")


    // if (!avatarLocalPath) {
    //     throw new ApiError(400, "Avatar file is required normal");
    // }
    // console.log("text 5")

    // const avatar = await uploadOnCloudinary(avatarLocalPath);
    // // const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    // console.log("text 6")

    // if (!avatar) {
    //     throw new ApiError(400, "Avatar file is required ", avatar);
    // }

    const user = await User.create({
        name,
        email,
        password,
        username: username.toLowerCase(),

    })
    console.log("text 6")


    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    console.log("text 6")

    if (createdUser) {
        sendWelcomeEmail(createdUser.email)
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Register succesfully ")
    )
})


const updateAvatar = asyncHandler(async(req, res) => {
    const thumbnail = req.file?.path
    const {user} = req.params
    const {location} = req.body
    console.log(thumbnail, location, user)
    //TODO: update tweet
    // const {updateTweet} = req.body
    // const {tweetId} = req.params

    if (!thumbnail || !user ||  !location) {
        throw new ApiError(200, "tweet and tweetid is required")
    }
    console.log("text 1");

    const avatar = await uploadOnCloudinary(thumbnail);

    console.log("avatar", avatar.url)

    const tweet = await User.findByIdAndUpdate(
        user,
        {
            $set: {
                avatar: avatar.url,
                location,
            }
        },
        {new: true}
    )

    if (!tweet) {
        throw new ApiError(400, "The tweet was not found.")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "succesfully updated the tweet"))

})

const updatePurpose = asyncHandler(async(req, res) => {
    // const {purpose} = req.body;
    const {user, purpose} = req.params

    console.log(purpose, user);

    //TODO: update tweet
    // const {updateTweet} = req.body
    // const {tweetId} = req.params

    if (!purpose || !user ) {
        throw new ApiError(400, "tweet and tweetid is required")
    }
    console.log("text 1");

    const tweet = await User.findByIdAndUpdate(
        user,
        {
            $set: {
                purpose,
            }
        },
        {new: true}
    )

    if (!tweet) {
        throw new ApiError(400, "The tweet was not found.")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "succesfully updated the user"))

})


export {
    registerUser,
    updateAvatar,
    updatePurpose,
}