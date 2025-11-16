import express from "express";

const router = express.Router();

import {
  getPosts,
  getPostsByUserId,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/posts.js";

router.get("/", getPosts);
router.get("/user/:user_id", getPostsByUserId);
router.get("/:id", getPostById);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export const postsRouter = router;