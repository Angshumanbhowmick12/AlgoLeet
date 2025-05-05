import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'


import authRoutes from './routes/auth.routes.js'
import problemRoutes from './routes/problem.routes.js'
import executionRoute from './routes/executeCode.routes.js'

dotenv.config({
    path:'./.env'
})


const app= express()

const PORT = process.env.PORT || 8000;

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())


app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/problems",problemRoutes)
app.use("/api/v1/execute-code",executionRoute)

app.listen(PORT,()=>{
    console.log(`Server listening on ${PORT}`);
    
})

