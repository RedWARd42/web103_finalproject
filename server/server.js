// import dotenv from 'dotenv'
// import express from 'express'

// dotenv.config()

// const PORT = process.env.PORT || 3000

// const app = express()

// app.use(express.json())

// app.get('/', (req, res) => {
//     res.send('Welcome to the API!');
// });
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import favicon from 'serve-favicon'
import dotenv from 'dotenv'
import itemsRouter from './routes/items.js'
import usersRouter from './routes/users.js';
import followsRouter from './routes/follows.js';


dotenv.config()

const PORT = process.env.PORT || 3001
const app = express()

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())

// Favicon path
const faviconPath = path.join(__dirname, '../client/public/lightning.png')

if (process.env.NODE_ENV === 'development') {
  app.use(favicon(faviconPath))
} else if (process.env.NODE_ENV === 'production') {
  app.use(favicon(path.join(__dirname, 'public', 'lightning.png')))
  app.use(express.static(path.join(__dirname, 'public')))
}

app.use('/api/items', itemsRouter)
app.use('/api/users', usersRouter);
app.use('/api/follows', followsRouter);


// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
  })
}



app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`)
})


