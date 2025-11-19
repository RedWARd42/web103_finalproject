import express from 'express';
import UsersController from '../controllers/users.js';

const router = express.Router();

router.get('/', UsersController.getUsers);
router.get('/:id', UsersController.getUserById);
router.get('/:id/profile', UsersController.getUserWithFollowing);

export default router;
