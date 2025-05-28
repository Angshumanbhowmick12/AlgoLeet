import { Router } from "express";
import { changeCurrentPassword, check, login, logout, refreshAccessToken, register, updateUserImage } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router=Router();

router.route('/register').post(upload.single("image"),register)
router.route("/login").post(login)
router.route("/logout").post(authMiddleware ,logout)
router.route('/refresh-token').post(refreshAccessToken)
router.route("/check").get(authMiddleware,check)
router.route("/change-password").get(authMiddleware,changeCurrentPassword)
router.route("/image").patch(authMiddleware,upload.single("image"),updateUserImage)


export default router 