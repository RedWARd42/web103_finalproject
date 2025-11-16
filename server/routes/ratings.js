import express from "express";

const router = express.Router();

import {
  getRatings,
  getRatingsByUserId,
  getRatingById,
  createRating,
  updateRating,
  deleteRating,
} from "../controllers/ratings.js";

router.get("/", getRatings);
router.get("/user/:user_id", getRatingsByUserId);
router.get("/:id", getRatingById);
router.post("/", createRating);
router.put("/:id", updateRating);
router.delete("/:id", deleteRating);

export const ratingsRouter = router;