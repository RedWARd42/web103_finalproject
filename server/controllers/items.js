import { pool } from '../config/database.js'

// Get all items with pagination and search
const getItems = async (req, res) => {
  try {
    const { page = 1, search = '', user_id } = req.query
    const limit = 12
    const offset = (page - 1) * limit

    let query = 'SELECT * FROM items'
    let countQuery = 'SELECT COUNT(*) FROM items'
    const params = []
    const conditions = []

    // Add search filter
    if (search) {
      conditions.push(`(title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1} OR category ILIKE $${params.length + 1})`)
      params.push(`%${search}%`)
    }

    // Add user filter
    if (user_id) {
      conditions.push(`user_id = $${params.length + 1}`)
      params.push(user_id)
    }

    // Apply conditions
    if (conditions.length > 0) {
      const whereClause = ` WHERE ${conditions.join(' AND ')}`
      query += whereClause
      countQuery += whereClause
    }

    query += ' ORDER BY created_at DESC'

    // Get total count
    const countResult = await pool.query(countQuery, params)
    const totalItems = parseInt(countResult.rows[0].count)
    const totalPages = Math.ceil(totalItems / limit)

    // Get paginated items
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    const queryParams = [...params, limit, offset]
    const itemsResult = await pool.query(query, queryParams)

    res.status(200).json({
      items: itemsResult.rows,
      totalPages,
      currentPage: parseInt(page),
      totalItems
    })
  } catch (error) {
    console.error('Error fetching items:', error)
    res.status(500).json({ error: error.message })
  }
}

// Get item by ID
const getItemById = async (req, res) => {
  try {
    const itemId = req.params.id
    const results = await pool.query('SELECT * FROM items WHERE id = $1', [itemId])
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

// Create new item
const createItem = async (req, res) => {
  const {
    title,
    description,
    category,
    location,
    available,
    post_type,
    rent_price,
    image_url,
    user_id
  } = req.body

  try {
    const result = await pool.query(
      `INSERT INTO items (
        title,
        description,
        category,
        location,
        available,
        post_type,
        rent_price,
        image_url,
        user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [title, description, category, location, available, post_type, rent_price, image_url, user_id]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Update item by ID
const updateItem = async (req, res) => {
  const id = req.params.id
  const {
    title,
    description,
    category,
    location,
    available,
    post_type,
    rent_price,
    image_url
  } = req.body

  try {
    const result = await pool.query(
      `UPDATE items SET
        title = $1,
        description = $2,
        category = $3,
        location = $4,
        available = $5,
        post_type = $6,
        rent_price = $7,
        image_url = $8
      WHERE id = $9
      RETURNING *`,
      [title, description, category, location, available, post_type, rent_price, image_url, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.status(200).json(result.rows[0])
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Delete item by ID
const deleteItem = async (req, res) => {
  const id = req.params.id

  try {
    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.status(200).json({ message: 'Item deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
}