import { pool } from "../config/database.js";

export const getRatings = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM ratings");
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRatingsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const results = await pool.query(
      "SELECT * FROM ratings WHERE rated_user = $1",
      [user_id]
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRatingById = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await pool.query("SELECT * FROM ratings WHERE id = $1", [
      id,
    ]);
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createRating = async (req, res) => {
  try {
    const { rated_by, rated_user, score, review } = req.body;
    const results = await pool.query(
      "INSERT INTO ratings (rated_by, rated_user, score, review) VALUES ($1, $2, $3, $4) RETURNING *",
      [rated_by, rated_user, score, review]
    );
    res.status(201).json(results.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rated_by, rated_user, score, review } = req.body;
    const results = await pool.query(
      "UPDATE ratings SET rated_by = $1, rated_user = $2, score = $3, review = $4 WHERE id = $5 RETURNING *",
      [rated_by, rated_user, score, review, id]
    );
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await pool.query("DELETE FROM ratings WHERE id = $1", [id]);
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
