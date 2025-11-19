import { pool } from './database.js'
import './dotenv.js' 
import { users, items, requests, follows, ratings } from './data.js'

// Create ITEMS table 
const initializeDatabaseTables = async () => {
  const createTableQuery = `
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS items CASCADE;
    DROP TABLE IF EXISTS requests CASCADE;
    DROP TABLE IF EXISTS follows CASCADE;
    DROP TABLE IF EXISTS ratings CASCADE;

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(20) CHECK (role IN ('borrower', 'lender', 'both')) DEFAULT 'both',
      rating NUMERIC(3,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE items (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      category VARCHAR(50),
      location VARCHAR(100),
      post_type VARCHAR(10) CHECK (post_type IN ('lend', 'borrow')) NOT NULL,
      rent_price NUMERIC(10,2),
      image_url TEXT,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(20) CHECK (status IN ('available', 'pending', 'borrowed')) DEFAULT 'available',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    

    CREATE TABLE requests (
      id SERIAL PRIMARY KEY,
      item_id INT REFERENCES items(id) ON DELETE CASCADE,
      borrower_id INT REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );


    CREATE TABLE follows (
      follower_id INT REFERENCES users(id) ON DELETE CASCADE,
      following_id INT REFERENCES users(id) ON DELETE CASCADE,
      PRIMARY KEY (follower_id, following_id)
    );


    CREATE TABLE ratings (
      id SERIAL PRIMARY KEY,
      rated_by INT REFERENCES users(id) ON DELETE CASCADE,
      rated_user INT REFERENCES users(id) ON DELETE CASCADE,
      score NUMERIC(3,2) CHECK (score >= 0 AND score <= 5),
      review TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

  try {
    const res = await pool.query(createTableQuery);
    console.log("🎉Tables created successfully.");
  } catch (error) {
    console.error("⚠️ error creating tables", error);
  }
};


//Populate items table with one sample data
const seedDatabaseTables = async () => {
  await initializeDatabaseTables();
  console.log("🎉 Tables initialized successfully.");

  try {

    for (const user of users) {
      const insertQuery = {
        text: "INSERT INTO users (username, email, password_hash, role, rating, created_at) VALUES ($1, $2, $3, $4, $5, $6)",
        values: [user.username, user.email, user.password_hash, user.role, user.rating, user.created_at],
      };
      await pool.query(insertQuery);
      console.log(`✅ ${user.username} added successfully`);
    }
    
    for (const item of items) {
      const insertQuery = {
        text: `INSERT INTO items (title, description, category, location, post_type, rent_price, image_url, user_id, status, created_at) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        values: [
          item.title,
          item.description,
          item.category,
          item.location,
          item.post_type,
          item.rent_price,
          item.image_url,
          item.user_id,
          item.status || "available", // default to "available" if not specified
          item.created_at
        ],
      };
      await pool.query(insertQuery);
      console.log(`✅ ${item.title} added successfully with status ${item.status || "available"}`);
    }
    

    for (const request of requests) {
      const insertQuery = {
        text: `INSERT INTO requests (item_id, borrower_id, status, message, created_at) VALUES ($1, $2, $3, $4, $5)`,
        values: [request.item_id, request.borrower_id, request.status, request.message, request.created_at],
      };
      await pool.query(insertQuery);
      console.log(`✅ Request for item ${request.item_id} added successfully`);
    }

    for (const follow of follows) {
      const insertQuery = {
        text: `INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)`,
        values: [follow.follower_id, follow.following_id],
      };
      await pool.query(insertQuery);
      console.log(`✅ Follow from ${follow.follower_id} to ${follow.following_id} added successfully`);
    }

    for (const rating of ratings) {
      const insertQuery = {
        text: `INSERT INTO ratings (rated_by, rated_user, score, review, created_at) VALUES ($1, $2, $3, $4, $5)`,
        values: [rating.rated_by, rating.rated_user, rating.score, rating.review, rating.created_at],
      };
      await pool.query(insertQuery);
      console.log(`✅ Rating for user ${rating.rated_user} added successfully`);
    }

    console.log("🎉 Database seeded successfully.");
  } catch (error) {
    console.error("⚠️ Error seeding database", error);
  }
};

seedDatabaseTables();

