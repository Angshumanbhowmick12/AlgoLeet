import bcrypt from'bcryptjs'
import { db } from '../libs/db.js'
import { asyncHandler } from '../utils/async-handler.js'
import { ApiError } from '../utils/api-error.js'
import { UserRole } from '../generated/prisma/index.js'
import jwt from 'jsonwebtoken'
import { ApiResponse } from '../utils/api-response.js'

const register= asyncHandler( async(req,res)=>{
 const {email,password,name}=req.body

 //console.log(db.user);
 

 const existingUser= await db.user.findUnique({
    where:{
        email
    }
 })

 if (existingUser) {
    throw new ApiError(409,'User already exists')
 }

 const hasedPassword=await bcrypt.hash(password,10);

 const newUser = await db.user.create({
    data:{
        email,
        password:hasedPassword,
        name,
        role:UserRole.USER
    }
 })

 const token = jwt.sign({
    id:newUser.id
 },
 process.env.JWT_SECRET,
 {
    expiresIn:"7d"
 }
)

res.cookie("jwt",token,{
    httpOnly:true,
    sameSite:"strict",
    secure:process.env.NODE_ENV !=="development",
    maxAge:1000*60*60*24*7 //7 days
})


res.status(200).json(
    new ApiResponse(200,newUser
    , "user login successfuly")
)

})

const login= asyncHandler(async(req,res)=>{
    const {email,password}=req.body;

    const user=await db.user.findUnique({
        where:{
            email
        }
    })

    if (!user) {
        throw new ApiError(404,"user not found")
    }

    const isMatch= await bcrypt.compare(password,user.password)

    if (!isMatch) {
        throw new ApiError(500,"Invalid Credentials")
    }

    const token = jwt.sign({id:user.id} , process.env.JWT_SECRET,{
        expiresIn:"7d"
    })

    res.cookie("jwt" , token , {
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV !== "development",
        maxAge:1000 * 60 * 60 * 24 * 7 // 7 days
    })

   res.status(200).json(
        new ApiResponse(200,"User successfuly Loggedin",user)
    )


})

const logout=asyncHandler(async(req,res)=>{
    res.clearCookie('jwt',{
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV !== "development",
    })

    res.status(200).json(
        new ApiResponse(200,"User logged out SuccessFully")
    )
})

const check=asyncHandler( async(req,res)=>{
 res.status(200).json(
    new ApiResponse(200,"User is Authenticated",req.user)
 )
     
})

export {
    register,
    login,
    logout,
    check
}


