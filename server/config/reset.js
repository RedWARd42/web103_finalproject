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
      available BOOLEAN DEFAULT TRUE,
      post_type VARCHAR(10) CHECK (post_type IN ('lend', 'borrow')) NOT NULL,
      rent_price NUMERIC(10,2),
      image_url TEXT,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
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
        text: `INSERT INTO items (title, description, category, location, available, post_type, rent_price, image_url, user_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        values: [item.title, item.description, item.category, item.location, item.available, item.post_type, item.rent_price, item.image_url, item.user_id, item.created_at],
      };
      await pool.query(insertQuery);
      console.log(`✅ ${item.title} added successfully`);
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

// import { pool } from './database.js'
// import './dotenv.js' 

// const createTables = async () => {
//   const createTableQuery = `
//     DROP TABLE IF EXISTS requests CASCADE;
//     DROP TABLE IF EXISTS follows CASCADE;
//     DROP TABLE IF EXISTS ratings CASCADE;
//     DROP TABLE IF EXISTS items CASCADE;
//     DROP TABLE IF EXISTS users CASCADE;

//     CREATE TABLE users (
//       id SERIAL PRIMARY KEY,
//       username VARCHAR(100) UNIQUE NOT NULL,
//       email VARCHAR(100) UNIQUE NOT NULL,
//       password_hash TEXT NOT NULL,
//       role VARCHAR(20) CHECK (role IN ('borrower', 'lender', 'both')) DEFAULT 'both',
//       rating NUMERIC(3,2),
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );

//     CREATE TABLE items (
//       id SERIAL PRIMARY KEY,
//       title VARCHAR(100) NOT NULL,
//       description TEXT,
//       category VARCHAR(50),
//       location VARCHAR(100),
//       available BOOLEAN DEFAULT TRUE,
//       post_type VARCHAR(10) CHECK (post_type IN ('lend', 'borrow')) NOT NULL,
//       rent_price NUMERIC(10,2),
//       image_url TEXT,
//       user_id INT REFERENCES users(id) ON DELETE CASCADE,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );
//   `

//   try {
//     await pool.query(createTableQuery)
//     console.log('🎉 users and items tables created successfully')
//   } catch (error) {
//     console.error('⚠️ Error creating tables:', error)
//   }
// }

// const seedTables = async () => {
//   const seedUsersQuery = `
//     INSERT INTO users (username, email, password_hash, role, rating) VALUES 
//     ('alex_tools', 'alex@example.com', 'hashed_password_123', 'lender', 4.8),
//     ('jordan_camper', 'jordan@example.com', 'hashed_password_456', 'both', 4.5),
//     ('casey_tech', 'casey@example.com', 'hashed_password_789', 'lender', 4.9),
//     ('sam_outdoors', 'sam@example.com', 'hashed_password_321', 'both', 4.2),
//     ('taylor_borrower', 'taylor@example.com', 'hashed_password_654', 'borrower', 4.6);
//   `

//   const seedItemsQuery = `
//     INSERT INTO items (title, description, category, location, available, post_type, rent_price, image_url, user_id) VALUES 
//     (
//       'Cordless Drill Set',
//       'DeWalt 20V cordless drill with battery and charger. Perfect for DIY projects.',
//       'Tools',
//       'Boston, MA',
//       true,
//       'lend',
//       15.00,
//       'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500',
//       1
//     ),
//     (
//       '4-Person Camping Tent',
//       'Spacious camping tent with rainfly. Great for weekend trips.',
//       'Outdoor',
//       'Cambridge, MA',
//       true,
//       'lend',
//       25.00,
//       'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500',
//       2
//     ),
//     (
//       'Mountain Bike',
//       'Trek mountain bike, 21-speed. Well maintained and ready to ride.',
//       'Sports',
//       'Somerville, MA',
//       true,
//       'lend',
//       20.00,
//       'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500',
//       4
//     ),
//     (
//       'GoPro Hero 11',
//       'Latest GoPro camera with accessories. Perfect for action shots and travel.',
//       'Electronics',
//       'Brookline, MA',
//       true,
//       'lend',
//       30.00,
//       'https://images.unsplash.com/photo-1606913084603-3e7702b01627?w=500',
//       3
//     ),
//     (
//       'Lawn Mower',
//       'Gas-powered push lawn mower. Ideal for medium-sized yards.',
//       'Garden',
//       'Newton, MA',
//       true,
//       'lend',
//       35.00,
//       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
//       1
//     ),
//     (
//       'Pressure Washer',
//       '2000 PSI electric pressure washer. Great for cleaning driveways and decks.',
//       'Tools',
//       'Medford, MA',
//       false,
//       'lend',
//       40.00,
//       'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500',
//       4
//     ),
//     (
//       'Kayak with Paddle',
//       'Single person kayak, includes life vest and paddle.',
//       'Sports',
//       'Watertown, MA',
//       true,
//       'lend',
//       45.00,
//       'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
//       2
//     ),
//     (
//       'Projector',
//       'Looking to borrow a projector for a presentation next week.',
//       'Electronics',
//       'Boston, MA',
//       true,
//       'borrow',
//       NULL,
//       NULL,
//       5
//     ),
//     (
//       'Ladder (Extension)',
//       '24-foot extension ladder. Good condition, can help with installation.',
//       'Tools',
//       'Quincy, MA',
//       true,
//       'lend',
//       20.00,
//       'https://images.unsplash.com/photo-1603712725038-c282e31c8d9f?w=500',
//       3
//     ),
//     (
//       'Party Tent 10x10',
//       'Need a party tent for an outdoor event this weekend.',
//       'Events',
//       'Cambridge, MA',
//       true,
//       'borrow',
//       NULL,
//       NULL,
//       5
//     );
//   `

//   try {
//     await pool.query(seedUsersQuery)
//     console.log('🌱 users table seeded successfully')
    
//     await pool.query(seedItemsQuery)
//     console.log('🌱 items table seeded successfully')
//   } catch (error) {
//     console.error('⚠️ Error seeding tables:', error)
//   }
// }

// const resetDatabase = async () => {
//   try {
//     console.log('🔄 Resetting database...')
//     await createTables()
//     await seedTables()
//     console.log('✅ Database reset complete')
//   } catch (error) {
//     console.error('❌ Database reset failed:', error)
//   } finally {
//     await pool.end()
//   }
// }

// resetDatabase()