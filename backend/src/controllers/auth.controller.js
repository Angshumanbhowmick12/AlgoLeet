import bcrypt from'bcryptjs'
import { db } from '../libs/db.js'
import { asyncHandler } from '../utils/async-handler.js'
import { ApiError } from '../utils/api-error.js'
import { UserRole } from '../generated/prisma/index.js'
import jwt from 'jsonwebtoken'
import { ApiResponse } from '../utils/api-response.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'



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
 
    console.log("hello from backend");
    
 const existingUser= await db.user.findUnique({
    where:{
        email
    }
 })
 

 if (existingUser) {
    throw new ApiError(409,'User already exists')
 }

 const imageLocalpath= req.file?.path



 const image= await uploadOnCloudinary(imageLocalpath,"image")

 if (imageLocalpath && !image) {
    throw new ApiError(400,"Error While uploading image on Cloudinary")
 }

 const hasedPassword=await bcrypt.hash(password,10);

 const newUser = await db.user.create({
    data:{
        email,
        password:hasedPassword,
        name,
        image: imageLocalpath ? image.url : null,
        role:UserRole.USER 
    }
 })

 res.status(200).json(
    new ApiResponse(200,newUser 
    ,"user register successfuly")
)

})

const login= asyncHandler(async(req,res)=>{
    const { email , password }= req.body;

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
    const incommingRefreshToken = req.cookies?.refreshToken|| req.body.refreshToken

    if(!incommingRefreshToken){
        throw new ApiError(401,"Unauthorized request from refresh token")
    }
    let decodedToken
    try {
        decodedToken=jwt.verify(incommingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

        console.log(decodedToken);
        
    } catch (error) {
        throw new ApiError("401","Invalid or expired refresh token")
    }
    

    const user = await db.user.findUnique({
        where:{
            id: decodedToken.id,
        }
    })

    if(!user){
        throw new ApiError(401,"Invalid refresh token")
    }

    console.log(user?.refreshToken);
    console.log(incommingRefreshToken);
    
    

    if(incommingRefreshToken !== user?.refreshToken){
        throw new ApiError(401,"Refresh token is expired and used")
    }

    const{accessToken,refreshToken:newAccessToken}= await generateAccessAndRefreshToken(user)
  
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
    new ApiResponse(200,req.user,"User is Authenticated")
 )
 
})


const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body

    if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new passwords are required");
    }
    
    const user= await db.user.findUnique({
        where:{
            id:req.user.id,
        }
    })

    if(!user){
        throw new ApiError(400,"User Doesn't Exist")
    }

    const isPasswordCorrect= await bcrypt.compare(oldPassword,user.password)

    if (!isPasswordCorrect) {
        throw new ApiError(400,"Password Incorrect")
    }

    const hasedPassword=await bcrypt.hash(newPassword,10)

    const updatedUserPassword = await db.user.update({
        where:{
            id:user.id,
        },
        data:{
            password:hasedPassword
        }
    })


    return res
    .status(201)
    .json(
        new ApiResponse(201,updatedUserPassword,"Password changed successfully")
    )

})

const updateUserImage = asyncHandler(async(req,res)=>{
    const imageLocalpath= req.file?.path

    if (!imageLocalpath) {
        throw new ApiError(401,"Image file is missing")
    }

    const newimage = await uploadOnCloudinary(imageLocalpath)

    if (!newimage.url) {
        throw new ApiError(400,"error while uploading on image")
    }

    const updateduser= await db.user.update({
        where:{
            id:req.user.id,
        },
        data:{
            image:newimage.url,
        }
    })

    return res  
        .status(200)
        .json(
            new ApiResponse(200,updateduser,"Image updated succesfully")
        )
})

export {
    register,
    login,
    logout,
    check,
    refreshAccessToken,
    changeCurrentPassword,
    updateUserImage
}


