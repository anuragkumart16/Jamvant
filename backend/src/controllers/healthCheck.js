import asyncHandler from "../utils/asyncHandler.js";

const healthCheck = asyncHandler((req,res)=>{
    res.status(200).json({
        message:"Server up and running!",
        success:true,
        status:200
    })
})

export {healthCheck}