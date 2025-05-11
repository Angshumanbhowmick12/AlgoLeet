import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllListDetails, getPlayListDetails, removeProblemFromPlaylist } from "../controllers/playlist.controller.js";

const router= Router()

router.route("/").get(authMiddleware,getAllListDetails)
router.route("/:playlistId").get(authMiddleware,getPlayListDetails)
router.route("/create-playlist").post(authMiddleware,createPlaylist)
router.route("/:playlistId/add-problem").post(authMiddleware,addProblemToPlaylist)
router.route("/:playlistId").delete(authMiddleware,deletePlaylist)
router.route("/:playlistId/remove-problem").delete(authMiddleware,removeProblemFromPlaylist)

export default router;