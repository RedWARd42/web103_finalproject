import express from "express";
import requestsController from "../controllers/requests.js";

const router = express.Router();

router.get("/items/:id/requests", requestsController.getRequestsByItem);
router.post("/requests", requestsController.createRequest);
router.put("/requests/:id", requestsController.updateRequestStatus);

export default router;
