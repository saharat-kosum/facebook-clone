import express from "express";
import {
  commentPost,
  deletePost,
  editPost,
  getAllPosts,
  getFeedPosts,
  getUserPosts,
  likePost,
} from "../Controllers/postController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", verifyToken, getFeedPosts);
router.get("/all", verifyToken, getAllPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.put("/:id/like", verifyToken, likePost);
router.delete("/delete/:_id", verifyToken, deletePost);
router.post("/add/comment/:id", verifyToken, commentPost);
router.put("/:id", verifyToken, editPost);

export default router;
