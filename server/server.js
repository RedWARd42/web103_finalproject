import dotenv from 'dotenv'
import express from 'express'
import passport from 'passport'
import session from 'express-session'
import cors from 'cors'
import { GitHub } from './config/auth.js'
import { postsRouter } from './routes/posts.js'
import { requestsRouter } from './routes/requests.js'
import { ratingsRouter } from './routes/ratings.js'

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(session({
    secret: 'codepath',
    resave: false,
    saveUninitialized: true
}))

app.use('/posts', postsRouter)
app.use('/requests', requestsRouter)
app.use('/ratings', ratingsRouter)

app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(GitHub)

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

