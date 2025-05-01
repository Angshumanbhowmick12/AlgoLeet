import { Router } from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getProblemById, updateProblem } from "../controllers/problem.controller.js";

const router=Router()

router.route("/create-problem").post(authMiddleware,checkAdmin,createProblem)
router.route("/get-all-problems").get(authMiddleware,getAllProblems)
router.route("/get-problem/:id").get(authMiddleware,getProblemById)
router.route("/update-problem/:id").put(authMiddleware,checkAdmin,updateProblem)
router.route("/delete-problem/:id").delete(authMiddleware,checkAdmin,deleteProblem)
router.route("/get-solve-problems").get(authMiddleware,getAllProblemsSolvedByUser)


export default router