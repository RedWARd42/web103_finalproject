import { pool } from "../config/database.js";

const createUsersTableQuery = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    githubid VARCHAR(100) UNIQUE NOT NULL,
    avatarurl VARCHAR(100),
    accesstoken VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('borrower', 'lender', 'both')) DEFAULT 'both',
    rating NUMERIC(3,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`
const createUsersItemsTableQuery = `
CREATE TABLE IF NOT EXISTS users_items (
    id serial PRIMARY KEY,
    item_id int NOT NULL,
    username text NOT NULL,
    FOREIGN KEY (item_id) REFERENCES items(id)
);
`
pool.query(createUsersTableQuery, (error, res) => {
    if (error) {
        console.log(error)
        return
    }
    
    console.log('✅ users table created successfully!')
    })
    
pool.query(createUsersItemsTableQuery, (error, res) => {
    if (error) {
        console.log(error)
        return
    }

    console.log('✅ users_items table created successfully!')
})

// Add user interest/watchlist for an item
export const createItemUser = async (req, res) => {
    try {
        const item_id = parseInt(req.params.item_id)
        const { username } = req.body

        const results = await pool.query(`
            INSERT INTO users_items (item_id, username)
            VALUES($1, $2)
            RETURNING *`,
            [item_id, username]
        )

        res.status(200).json(results.rows[0])

        console.log('🆕 added user to item')
    }

    catch (error) {
        res.status(409).json( { error: error.message } )
        console.log('Error:', error.message)
    }
}

// Get all items a user is interested in (watchlist)
export const getItemUsers = async (req, res) => {
    try {
        const item_id = parseInt(req.params.item_id)
        const results = await pool.query('SELECT * FROM users_items WHERE item_id = $1', [item_id])
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json( { error: error.message } )
        console.log('🚫 unable to GET all users  - Error:', error.message)
    }
}

// Get items owned by a user (different from watchlist)
export const getUserOwnedItems = async (req, res) => {
    try {
        const username = req.params.username
        
        // First get user ID
        const userResult = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        )
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' })
        }
        
        // Get items owned by this user
        const results = await pool.query(
            'SELECT * FROM items WHERE user_id = $1 ORDER BY created_at DESC',
            [userResult.rows[0].id]
        )
        
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json({ error: error.message })
        console.log('🚫 unable to GET user owned items - Error:', error.message)
    }
}

export const getUserItems = async (req, res) => {
    try {
        const username = req.params.username
        const results = await pool.query(`
            SELECT i.* FROM users_items ui, items i
            WHERE ui.item_id = i.id
            AND ui.username = $1`,
            [username]
        )
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json({ error: error.message })
        console.log('🚫 unable to GET user items - Error:', error.message)
    }
}