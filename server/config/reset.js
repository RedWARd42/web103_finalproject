import { pool } from './database.js'
import './dotenv.js' 

// Populate ITEMS table  with some sample data - NOT DONE
const createItemsTable = async () => {
    const createTableQuery = `
    DROP TABLE IF EXISTS items CASCADE; 

    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      item_name VARCHAR(100) NOT NULL,
      user_name VARCHAR(100) NOT NULL,
      location VARCHAR(50) NOT NULL,
      rating NUMERIC(10, 2) NOT NULL,
      rent_price NUMERIC(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await pool.query(createTableQuery)
    console.log('items table created successfully')
  } catch (err) {
    console.error('⚠️ Error creating items table:', err)
  }
}

// Populate items table with one sample data
const seedItemsTable = async () => {
    const seedQuery = `
      INSERT INTO items (
        item_name,
        user_name,
        location,
        rating,
        rent_price,
      ) VALUES 
      (
        'Lawn Mower',
        'Jim',
        'Detroit, MI',
        4.6,
        00.00
      );
    `
    try {
      await pool.query(seedQuery)
      console.log('🌱 diy_delight table seeded successfully')
    } catch (err) {
      console.error('⚠️ Error seeding diy_delight table:', err)
    }
  }



const resetDatabase = async () => {
    try {
      console.log('Resetting database...')
      await createItemsTable()
      await seedItemsTable()
      console.log('✅ Database reset complete')
    } catch (err) {
      console.error('❌ Database reset failed:', err)
    } finally {
      await pool.end()
    }
  }
  
  resetDatabase()