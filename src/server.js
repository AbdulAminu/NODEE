import express from "express"
import userRoute from "./routes/userRoutes.js"
import dotenv from "dotenv"
dotenv.config()
import { connectToDb } from "./config/dbConnect.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    credentials:true
}))
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
await connectToDb()


app.use(userRoute)


if(process.env.NODE_ENV !== "production"){
app.listen(3000, ()=>{
    console.log(`Server is running on http://localhost:3000`)
})
}

export default app