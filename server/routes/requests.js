import express from "express";

const router = express.Router();

import {
  getRequests,
  getRequestsByItemId,
  getRequestsByBorrowerId,
  getRequestsByLenderId,
  getRequestsByStatus,
  getRequestsByMessage,
  getRequestsByCreatedAt,
  getRequestsByItemIdAndBorrowerId,
  createRequest,
} from "../controllers/requests.js";

router.get("/", getRequests);
router.get("/item/:item_id", getRequestsByItemId);
router.get("/borrower/:borrower_id", getRequestsByBorrowerId);
router.get("/lender/:lender_id", getRequestsByLenderId);
router.get("/status/:status", getRequestsByStatus);
router.get("/message/:message", getRequestsByMessage);
router.get("/created_at/:created_at", getRequestsByCreatedAt);
router.get("/item/:item_id/borrower/:borrower_id", getRequestsByItemIdAndBorrowerId);
router.post("/", createRequest);

export const requestsRouter = router;