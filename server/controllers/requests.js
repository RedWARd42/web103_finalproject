import { pool } from "../config/database.js";

/* ---------------------------------------------
   1. GET all requests for a specific item
   Route: GET /api/items/:id/requests
----------------------------------------------*/
const getRequestsByItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    const result = await pool.query(
      `SELECT *
       FROM requests
       WHERE item_id = $1
       ORDER BY created_at DESC`,
      [itemId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ---------------------------------------------
   2. CREATE a new request
   Route: POST /api/requests
----------------------------------------------*/
const createRequest = async (req, res) => {
  try {
    const { item_id, borrower_id, message, start_date, end_date } = req.body;

    const result = await pool.query(
      `INSERT INTO requests (
          item_id,
          borrower_id,
          status,
          message,
          start_date,
          end_date,
          created_at
       ) VALUES ($1, $2, 'pending', $3, $4, $5, NOW())
       RETURNING *`,
      [item_id, borrower_id, message, start_date, end_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ---------------------------------------------
   3. UPDATE request status (accept / reject)
   Route: PUT /api/requests/:id
----------------------------------------------*/
const updateRequestStatus = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;

    const validStatuses = ["pending", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const result = await pool.query(
      `UPDATE requests
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, requestId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ error: error.message });
  }
};

export default {
  getRequestsByItem,
  createRequest,
  updateRequestStatus
};
