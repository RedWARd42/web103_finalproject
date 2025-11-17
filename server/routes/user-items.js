import express from 'express'
import { 
    createItemUser, 
    getItemUsers, 
    getUserItems,
    getUserOwnedItems 
} from '../controllers/users-items.js'

const router = express.Router()

// Add user to item watchlist/interest list
router.post('/create/:item_id', createItemUser)

// Get all users interested in an item
router.get('/users/:item_id', getItemUsers)

// Get user's watchlist (items they're interested in)
router.get('/watchlist/:username', getUserItems)

// Get items owned by a user
router.get('/owned/:username', getUserOwnedItems)

export default router