import { pool } from './database.js'
import './dotenv.js' 

// Create ITEMS table 
const createItemsTable = async () => {
    const createTableQuery = `
      DROP TABLE IF EXISTS items CASCADE; 
  
      CREATE TABLE items (
        id SERIAL PRIMARY KEY,                     
        item_name VARCHAR(100) NOT NULL,             
        description TEXT,                          
        category VARCHAR(50),                      
        location VARCHAR(100),                    
        rent_price NUMERIC(10,2),
        rating NUMERIC(10,2),                  
        available BOOLEAN DEFAULT TRUE,           
        user_id INT REFERENCES users(id),          
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
  
    try {
      await pool.query(createTableQuery);
      console.log('items table created successfully');
    } catch (err) {
      console.error('Error creating items table:', err);
    }
  };
  

// Populate ITEMS table with one sample data
const seedItemsTable = async () => {
    const seedQuery = `
      INSERT INTO items (
        item_name,
        description,
        category, 
        location,
        rent_price,
        rating, 
        available,
        user_id
      ) VALUES 
      (
        'Lawn Mower',
        'Gas-powered mower in great condition. Perfect for medium lawns',
        'Tools & Equipment',
        'Detroit, MI',
        00.00,
        4.6,
        TRUE,
        1
      );
    `
    try {
      await pool.query(seedQuery)
      console.log('items table seeded successfully')
    } catch (err) {
      console.error('Error seeding items table:', err)
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