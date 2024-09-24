import dotenv from "dotenv"
dotenv.config();

import { app } from "./app.js"
import { DBConnection } from "./db/index.js"

const port = process.env.PORT || 8000

DBConnection()
  .then(()=>{
    app.on("error", (err) => {
      console.log("MongoDB Connection Err :", err)
    })
    app.listen(port, () => {
      console.log(`App is listening on http://localhost:${port}`)
    })
})
  .catch((err) => {
    console.log("MongoDB Database Error : ", err)
  })

//  ALTERNATE DATABASE CONNECTION APPROACH BUT NOT STANDARD
// ;(async()=>{
//     try{
//  await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)
//      console.log("Database connected !!")
//      app.on("error",(err)=>{
//         console.log("database app err :", err)
//      })
//     }catch(err){
//         console.log("Connection Error :",err)
//         throw(err)
//     }
// })();
