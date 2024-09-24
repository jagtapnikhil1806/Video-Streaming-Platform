import mongoose from 'mongoose'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema = new mongoose.Schema(
    {
        username:{
            type:String ,
            unique:true, 
            required:true,
            trim:true,
            lowercase:true,
            index:true,
        },
        email:{
            type:String ,
            unique:true, 
            required:true,
            lowercase:true,
            trim:true
           
        },
        fullName:{
            type:String , 
            required:true,
            index:true,
            trim:true

        },
       avatar:{
            type:String , //cloudnary url
            required:true,
        },
       coverImage:{
            type:String ,
           
        },
        watchHistory:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required : true
        },
        refreshToken:{
            type:String
        }
        
    },
    {
        timestamps:true
    })

userSchema.pre('save',async function (next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10)
    
    next()
})

userSchema.methods.isPasswordCorrect=async function (password){
     
   return  bcrypt.compare(password,this.password
   )
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
        _id:this.id,
        username:this.username,
        email:this.eamil,
        fullName:this.fullName
       
        },process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        })
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
        _id:this.id
         },
         process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User = mongoose.model("User",userSchema)