import { pool } from '../config/database.js';

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, role, rating FROM users ORDER BY username ASC'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await pool.query(
      'SELECT id, username, email, role, rating FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
};

export default {
  getUsers,
  getUserById
};
