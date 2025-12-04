import { Router } from "express";
import {
  signup,
  login,
  checkEmail,
  forgotPassword,
  resetPassword,
  updatePushToken,
} from "../controllers/auth.js";
import checkUser from "../middleware/auth.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/check-email").post(checkEmail);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/update-push-token").post(checkUser, updatePushToken);

export default router;
