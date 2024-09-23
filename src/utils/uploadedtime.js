import { apiError } from "./apiError.js";


const uploadedTime=async(entity,id)=>{
    const result=await entity.findById(id) 
    if(!result){
        throw new apiError(400,"Not Found")
    }
    const creationDate=result.createdAt;
    const seconds=(new Date()-creationDate)/1000;

    const minute=60;
    const hour=minute*60;
    const day=hour*24;
    const week=day*7;
    const month=day*30;
    const year=month*12

    if(!seconds){
        throw new apiError("Id not Found")
    }
   

    if(seconds<minute){
        return `${seconds} seconds ago`
    }
    else if(seconds<hour){
        let output=Math.floor(seconds/minute)
        
        return `${output} minute${output>1?"s":""} ago`
    }
    else if(seconds<day){
        let output=Math.floor(seconds/hour)
        
        return `${output} hour${output>1?"s":""} ago`
    }
    else if(seconds<week){
        let output=Math.floor(seconds/day)
        
        return `${output} day${output>1?"s":""} ago`
    }
    else if(seconds<month){
        let output=Math.floor(seconds/week)
        
        return `${output} week${output>1?"s":""} ago`
    }
    else if(seconds<year){
        let output=Math.floor(seconds/month)
        
        return `${output} month${output>1?"s":""} ago`
    }
    else {
        let output=Math.floor(seconds/year)
       
        return `${output} year${output>1?"s":""} ago`
    }
     
    


}



export {uploadedTime}