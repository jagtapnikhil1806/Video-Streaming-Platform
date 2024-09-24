import mongoose from 'mongoose';

const tweetSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    owner:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Tweet=mongoose.model("Tweet",tweetSchema)