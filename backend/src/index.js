import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'
import authRouter from './routes/auth.routes.js'

dotenv.config({
    path:'./.env'
})


const app= express()

const PORT = process.env.PORT || 8000;

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())


app.use("/api/v1/auth",authRouter)

app.listen(PORT,()=>{
    console.log(`Server listening on ${PORT}`);
    
})

