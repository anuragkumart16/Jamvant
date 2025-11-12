import dotenv from 'dotenv'
dotenv.config()
import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({ origin: process.env.ALLOWED_ORIGIN , credentials: true }))

// router imports
import healthCheckRouter from './routes/healthCheck.js'
import authRouter from './routes/auth.js'

app.use('/healthcheck', healthCheckRouter)
app.use('/auth', authRouter)

export default app