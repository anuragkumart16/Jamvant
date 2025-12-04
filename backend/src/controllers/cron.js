import { sendNotifications } from "../services/scheduler.js";
import asyncHandler from "../utils/asyncHandler.js";


const sendNotificationController = asyncHandler(async(req,res)=>{
    await sendNotifications();
    res.json({message:"Notifications sent successfully"})
})

export { sendNotificationController }