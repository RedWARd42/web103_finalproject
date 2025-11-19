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

// Get user profile with following information
const getUserWithFollowing = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Get user details
    let userQuery = await pool.query(
      'SELECT id, username, email, role, rating FROM users WHERE id = $1',
      [userId]
    );
    
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = userQuery.rows[0];
    
    // Get users this user is following
    const followingQuery = await pool.query(`
      SELECT u.id, u.username, u.email, u.role, u.rating
      FROM users u
      INNER JOIN follows f ON u.id = f.following_id
      WHERE f.follower_id = $1
      ORDER BY u.username
    `, [userId]);
    
    // Get this user's followers
    const followersQuery = await pool.query(`
      SELECT u.id, u.username, u.email, u.role, u.rating
      FROM users u
      INNER JOIN follows f ON u.id = f.follower_id
      WHERE f.following_id = $1
      ORDER BY u.username
    `, [userId]);
    
    user.following = followingQuery.rows;
    user.followers = followersQuery.rows;
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user with following info:', error);
    res.status(500).json({ error: error.message });
  }
};

export default {
  getUsers,
  getUserById,
  getUserWithFollowing
};
