import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { executeCode } from "../controllers/executeCode.controller.js";


const router=Router()

router.route('/').post(authMiddleware,executeCode)

export default router