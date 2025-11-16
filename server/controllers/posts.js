import { pool } from '../config/database.js'

export const getPosts = async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM posts')
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getPostsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params
    const results = await pool.query('SELECT * FROM posts WHERE user_id = $1', [user_id])
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params
    const results = await pool.query('SELECT * FROM posts WHERE id = $1', [id])
    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createPost = async (req, res) => {
  try {
    const { title, description, category, location, available, post_type, rent_price, user_id } = req.body
    const results = await pool.query(
      'INSERT INTO posts (title, description, category, location, available, post_type, rent_price, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, description, category, location, available, post_type, rent_price, user_id]
      )
    res.status(201).json(results.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, category, location, available, post_type, rent_price, user_id } = req.body
    const results = await pool.query(
      'UPDATE posts SET title = $1, description = $2, category = $3, location = $4, available = $5, post_type = $6, rent_price = $7, user_id = $8 WHERE id = $9 RETURNING *',
      [title, description, category, location, available, post_type, rent_price, user_id, id]
      )
    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params
    const results = await pool.query('DELETE FROM posts WHERE id = $1', [id])
    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
