import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const videoSchema= new mongoose.Schema(
    {
        videoFile:{
            type:String,
            required:true
        },
        thumbnail:{
            type: String,
            requird :true
        },
        title:{
            type:String, 
            required :true
        },
        description:{
            type:String, 
            required :true
        },
        duration:{
            type:Number, 
            required :true
        },
        views:{
            type:Number, 
            default:0
        },
        isPublished:{
            type:Boolean,
            required:true
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps:true
    })


   videoSchema.methods.incrementView=async function(videoId){
     this.views+= 1
     return this.save()

   }


videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video",videoSchema)