import { Router } from "express";
import { check, login, logout, register } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router=Router();

router.route('/register').post(register)
router.route("/login").get(login)
router.route("/logout").post(authMiddleware ,logout)
router.route("/check").get(authMiddleware,check)


export default router