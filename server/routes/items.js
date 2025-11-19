import express from 'express'
import ItemsController from '../controllers/items.js'
import RequestsController from '../controllers/requests.js'

const router = express.Router()

router.get('/', ItemsController.getItems)

router.get('/:id', ItemsController.getItemById)

router.post('/', ItemsController.createItem)

router.put('/:id', ItemsController.updateItem)

router.delete('/:id', ItemsController.deleteItem)

// Get requests for a specific item (support frontend path: /api/items/:id/requests)
router.get('/:id/requests', RequestsController.getRequestsByItem)

export default router