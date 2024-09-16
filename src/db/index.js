import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const DBConnection=async()=>{
    try{
    const DBconn=await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)
    console.log("Database Connection Successful !!!")
    console.log(DBconn.connection.host)
    }catch(err){
        console.log("Database Connection Err :",err)
        
        process.exit(1)
    //    throw(err)
    }
}

export default DBConnection;