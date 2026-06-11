import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json({ limit: "16kb" })) //for json 
app.use(express.urlencoded({ extended: true, limit: '16kb' })) //for urlencodeing like %20 + etc.
app.use(express.static("public")) //for static files like png, images and favicon
app.use(cookieParser()) //for accessing and curd operation on user cookie

//import routes
import router from './routes/user.routes.js'
app.use('/api/v1/users', router)

export default app

