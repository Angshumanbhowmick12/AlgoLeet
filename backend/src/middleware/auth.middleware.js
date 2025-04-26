import { db } from "../libs/db.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken"

const authMiddleware = asyncHandler(async(req,res,next)=>{
    const token= req.cookies.jwt

    if (!token) {
        throw new ApiError(402,"unauthorized -no token provided")
    }
    
    let decoded;

    decoded= jwt.verify(token,process.env.JWT_SECRET)

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


export{
    authMiddleware
}