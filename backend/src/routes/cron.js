import { Router } from "express";
import { sendNotificationController } from "../controllers/cron.js";

const router = Router();

router.route('/').get(sendNotificationController)

export default router;
