import { pool } from '../config/database.js';

// Get all users a specific user is following
const getFollowing = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    const query = `
      SELECT u.id, u.username, u.email, u.role, u.rating
      FROM users u
      INNER JOIN follows f ON u.id = f.following_id
      WHERE f.follower_id = $1
      ORDER BY u.username
    `;
    
    const result = await pool.query(query, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching following list:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get followers of a specific user
const getFollowers = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    const query = `
      SELECT u.id, u.username, u.email, u.role, u.rating
      FROM users u
      INNER JOIN follows f ON u.id = f.follower_id
      WHERE f.following_id = $1
      ORDER BY u.username
    `;
    
    const result = await pool.query(query, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching followers list:', error);
    res.status(500).json({ error: error.message });
  }
};

// Follow a user
const followUser = async (req, res) => {
  try {
    const followerId = parseInt(req.body.followerId);  // Currently logged in user
    const followingId = parseInt(req.body.followingId);  // User to follow
    
    if (followerId === followingId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    
    const query = 'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *';
    const result = await pool.query(query, [followerId, followingId]);
    
    if (result.rowCount === 0) {
      return res.status(409).json({ message: 'Already following this user or error occurred' });
    }
    
    res.status(201).json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  try {
    const followerId = parseInt(req.body.followerId);  // Currently logged in user
    const followingId = parseInt(req.body.followingId);  // User to unfollow
    
    const query = 'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2';
    const result = await pool.query(query, [followerId, followingId]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Not following this user' });
    }
    
    res.status(200).json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Check if a user is following another user
const checkFollowingStatus = async (req, res) => {
  try {
    const followerId = parseInt(req.query.followerId);
    const followingId = parseInt(req.query.followingId);
    
    const query = 'SELECT EXISTS(SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2) as is_following';
    const result = await pool.query(query, [followerId, followingId]);
    
    res.status(200).json({ isFollowing: result.rows[0].is_following });
  } catch (error) {
    console.error('Error checking following status:', error);
    res.status(500).json({ error: error.message });
  }
};

export default {
  getFollowing,
  getFollowers,
  followUser,
  unfollowUser,
  checkFollowingStatus
};