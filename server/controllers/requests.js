import { pool } from '../config/database.js';

// Get all requests for a specific item
const getRequestsByItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const results = await pool.query(
      `SELECT r.*, u.username as borrower_name 
       FROM requests r 
       JOIN users u ON r.borrower_id = u.id 
       WHERE r.item_id = $1 
       ORDER BY r.created_at DESC`, 
      [itemId]
    );
    res.status(200).json(results.rows);
  } catch (error) {
    console.error('Error fetching requests by item:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all requests made by a specific borrower
const getRequestsByBorrower = async (req, res) => {
  try {
    const borrowerId = req.params.borrowerId;
    const results = await pool.query(
      `SELECT r.*, i.title as item_title, i.description as item_description, u.username as item_owner 
       FROM requests r 
       JOIN items i ON r.item_id = i.id 
       JOIN users u ON i.user_id = u.id 
       WHERE r.borrower_id = $1 
       ORDER BY r.created_at DESC`, 
      [borrowerId]
    );
    res.status(200).json(results.rows);
  } catch (error) {
    console.error('Error fetching requests by borrower:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a specific request by ID
const getRequestById = async (req, res) => {
  try {
    const requestId = req.params.id;
    const result = await pool.query(
      `SELECT r.*, u.username as borrower_name, i.title as item_title 
       FROM requests r 
       JOIN users u ON r.borrower_id = u.id 
       JOIN items i ON r.item_id = i.id 
       WHERE r.id = $1`, 
      [requestId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching request by ID:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new request
const createRequest = async (req, res) => {
  const { item_id, borrower_id, message } = req.body;

  try {
    // Check if the item exists and is available
    const itemResult = await pool.query('SELECT * FROM items WHERE id = $1', [item_id]);
    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const item = itemResult.rows[0];
    if (item.status !== 'available') {
      return res.status(400).json({ error: 'Item is not available for request' });
    }

    // Check if the borrower is not the item owner
    if (item.user_id === borrower_id) {
      return res.status(400).json({ error: 'Cannot request your own item' });
    }

    // Check if a request already exists for this item from this borrower
    const existingRequest = await pool.query(
      'SELECT * FROM requests WHERE item_id = $1 AND borrower_id = $2 AND status = $3',
      [item_id, borrower_id, 'pending']
    );
    
    if (existingRequest.rows.length > 0) {
      return res.status(409).json({ error: 'A request for this item already exists' });
    }

    const result = await pool.query(
      `INSERT INTO requests (item_id, borrower_id, message) VALUES ($1, $2, $3) RETURNING *`,
      [item_id, borrower_id, message]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update a request (for accepting/rejecting)
const updateRequest = async (req, res) => {
  const requestId = req.params.id;
  const { status } = req.body;

  try {
    // First get the current request
    const currentRequest = await pool.query('SELECT * FROM requests WHERE id = $1', [requestId]);
    if (currentRequest.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const request = currentRequest.rows[0];
    
    // Validate status
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Update the request
    const result = await pool.query(
      'UPDATE requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, requestId]
    );

    // If the request was accepted, update the item status to 'pending'
    if (status === 'accepted') {
      await pool.query('UPDATE items SET status = $1 WHERE id = $2', ['pending', request.item_id]);
    }
    // If the request was rejected and it was the only pending request, set item back to 'available'
    else if (status === 'rejected') {
      const pendingRequests = await pool.query(
        'SELECT COUNT(*) FROM requests WHERE item_id = $1 AND status = $2',
        [request.item_id, 'pending']
      );
      
      // If no other pending requests, set item back to available
      if (parseInt(pendingRequests.rows[0].count) === 0) {
        await pool.query('UPDATE items SET status = $1 WHERE id = $2', ['available', request.item_id]);
      }
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a request
const deleteRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM requests WHERE id = $1 RETURNING *', [requestId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ error: error.message });
  }
};

export default {
  getRequestsByItem,
  getRequestsByBorrower,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest
};