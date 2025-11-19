import express from 'express';
import FollowsController from '../controllers/follows.js';

const router = express.Router();

// Get users that a specific user is following
router.get('/following/:userId', FollowsController.getFollowing);

// Get followers of a specific user
router.get('/followers/:userId', FollowsController.getFollowers);

// Follow a user
router.post('/', FollowsController.followUser);

// Unfollow a user
router.delete('/', FollowsController.unfollowUser);

// Check if a user is following another user
router.get('/status', FollowsController.checkFollowingStatus);

export default router;