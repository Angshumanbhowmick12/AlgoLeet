import bcrypt from'bcryptjs'
import { db } from '../libs/db.js'
import { asyncHandler } from '../utils/async-handler.js'
import { ApiError } from '../utils/api-error.js'
import { UserRole } from '../generated/prisma/index.js'
import jwt from 'jsonwebtoken'
import { ApiResponse } from '../utils/api-response.js'

const generateAccessAndRefreshToken= async(user)=>{
    const accessToken = jwt.sign(
       {
        id:user.id,
        email:user.email,
        name:user.name,
       },
       process.env.ACCESS_TOKEN_SECRET,
       {
        expiresIn:"7d"
       }

    )


const refreshToken= jwt.sign(
        {
            id:user.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:"30d"}
    )



await db.user.update({
    where:{id:user.id},
    data:{
        refreshToken:refreshToken,
    }
})

return {accessToken,refreshToken}
}


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

 res.status(200).json(
    new ApiResponse(200,newUser 
    ,"user register successfuly")
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

    // const token = jwt.sign({id:user.id} , process.env.JWT_SECRET,{
    //     expiresIn:"7d"
    // })

    const{accessToken,refreshToken}=await generateAccessAndRefreshToken(user)

    const loggedinUser= await db.user.findUnique({
        where:{
            id:user.id
        }
    })


   
    res.cookie("accessToken" ,accessToken, {
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV !== "development",
        maxAge:1000 * 60 * 60 * 24 * 7 // 7 days
    })
    .cookie("refreshToken" ,refreshToken, {
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV !== "development",
        maxAge:1000 * 60 * 60 * 24 * 7 // 7 days
    })

   res.status(200).json(
        new ApiResponse(200,{user: loggedinUser,accessToken,refreshToken},"User logged in successfully")
    )


})

const logout=asyncHandler(async(req,res)=>{
    await db.user.update({
        where:{
            id:req.user.id
        },
        data:{
            refreshToken:null
        }
    })

    return res 
        .status(200)
        .clearCookie('accessToken',{
            httpOnly:true,
            sameSite:'strict',
            secure:process.env.NODE_ENV!=='development'
        })
        .clearCookie('refreshToken',{
            httpOnly:true,
            sameSite:'strict',
            secure:process.env.NODE_ENV!=='development'
        })
        .json(
            new ApiResponse(200,{},"User logged out")
        )

})


const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incommingRefreshToken = req.cookie?.refreshToken || req.body.refreshToken

    if(!incommingRefreshToken){
        throw new ApiError(401,"Unauthorized request from refresh token")
    }

    const decodedToken=jwt.verify(incommingRefreshToken,REFRESH_TOKEN_SECRET)

    const user = await db.user.findUnique({
        where:{
            id: decodedToken.id,
        }
    })

    if(!user){
        throw new ApiError(401,"Invalid refresh token")
    }

    if(incommingRefreshToken !== user?.refreshToken){
        throw new ApiError(401,"Refresh token is expired and used")
    }

    const {accessToken,newAccessToken}=generateAccessAndRefreshToken(user)

    return res
        .status(200)
        .cookie("accessToken",accessToken,{
            httpOnly:true,
            secure:true
        })
        .cookie("refreshToken",newAccessToken,{
            httpOnly:true,
            secure:true
        })
        .json(
            new ApiResponse(200,{accessToken,refreshToken:newAccessToken})
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
    check,
    refreshAccessToken
}


