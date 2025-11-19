import express from 'express';
import RequestsController from '../controllers/requests.js';

const router = express.Router();

// Get all requests for an item
router.get('/item/:itemId', RequestsController.getRequestsByItem);

// Get all requests by a borrower
router.get('/borrower/:borrowerId', RequestsController.getRequestsByBorrower);

// Get a specific request
router.get('/:id', RequestsController.getRequestById);

// Create a new request
router.post('/', RequestsController.createRequest);

// Update a request (for accepting/rejecting)
router.put('/:id', RequestsController.updateRequest);

// Delete a request
router.delete('/:id', RequestsController.deleteRequest);
export default router;