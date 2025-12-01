import { Router } from "express";
import { createFloat,getFloat,updateFloat,deleteFloat,deleteManyFloats } from "../controllers/float.js";
import checkUser from "../middleware/auth.js";

const router = Router()

router.route("/create").post(checkUser,createFloat)
router.route("/get").get(checkUser,getFloat)
router.route("/update/:id").put(checkUser,updateFloat)
router.route("/delete/:id").delete(checkUser,deleteFloat)
router.route("/deleteMany").delete(checkUser,deleteManyFloats)

export default router