import { pool } from '../config/database.js'

export const getRequests = async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM requests')
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getRequestsByItemId = async (req, res) => {
  try {
    const { item_id } = req.params
    const results = await pool.query('SELECT * FROM requests WHERE item_id = $1', [item_id])
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getRequestsByBorrowerId = async (req, res) => {
  try {
    const { borrower_id } = req.params
    const results = await pool.query('SELECT * FROM requests WHERE borrower_id = $1', [borrower_id])
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getRequestsByLenderId = async (req, res) => {
  try {
    const { lender_id } = req.params
    const results = await pool.query('SELECT * FROM requests WHERE lender_id = $1', [lender_id])
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getRequestsByStatus = async (req, res) => {
  try {
    const { status } = req.params
    const results = await pool.query('SELECT * FROM requests WHERE status = $1', [status])
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getRequestsByMessage = async (req, res) => {
  try {
    const { message } = req.params
    const results = await pool.query('SELECT * FROM requests WHERE message = $1', [message])
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getRequestsByCreatedAt = async (req, res) => {
  try {
    const { created_at } = req.params
    const results = await pool.query('SELECT * FROM requests WHERE created_at = $1', [created_at])
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getRequestsByItemIdAndBorrowerId = async (req, res) => {
  try {
    const { item_id, borrower_id } = req.params
    const results = await pool.query('SELECT * FROM requests WHERE item_id = $1 AND borrower_id = $2', [item_id, borrower_id])
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createRequest = async (req, res) => {
  try {
    const { item_id, borrower_id, status, message } = req.body
    const results = await pool.query(
      'INSERT INTO requests (item_id, borrower_id, status, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [item_id, borrower_id, status, message]
      )
    res.status(201).json(results.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}