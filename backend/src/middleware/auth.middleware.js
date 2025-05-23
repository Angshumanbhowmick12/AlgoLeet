import { db } from "../libs/db.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken"

const authMiddleware = asyncHandler(async(req,res,next)=>{
    const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    // console.log(req.cookies)
    
    if (!token) {
        throw new ApiError(402,"unauthorized -no token provided")
    }
    
    let decoded;

    decoded= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    if (!decoded) {
        throw new ApiError(401,"unauthorized user")
    }

    const user=await db.user.findUnique({
        where:{
            id:decoded.id
        },
        select:{
            id:true,
            image:true,
            name:true,
            email:true,
            role:true 
        }
    })

    if (!user) {
        throw new ApiError(404,"user not availabe")
    }

    req.user=user

    next()
})

const checkAdmin= asyncHandler(async(req,res,next)=>{
    const userId=req.user.id;

    const user= await db.user.findUnique({
        where:{
            id:userId
        },
        select:{
            role:true
        }
    })

    if (!user || user.role !== "ADMIN") {
        throw new ApiError(403,"Access denied -Admins only")
    }

    next()
})


export{
    authMiddleware,
    checkAdmin
}