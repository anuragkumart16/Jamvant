import dotenv from 'dotenv'
dotenv.config()
import express from "express"
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

// router imports
import healthCheckRouter from './routes/healthCheck.js'

app.use('/healthcheck', healthCheckRouter)

export default app