import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'

import dotenv from "dotenv"

dotenv.config();

 cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

const uploadOnCloudinary = async(localFilePath,folder)=>{
    try {
        
        if (!localFilePath) return null

        const response = await cloudinary.uploader.upload(
            localFilePath,{
                resource_type:"auto",
                folder:`backend/${folder}`
            }
        )

        console.log("File is uploded on cloudinary",response.url);
        fs.unlinkSync(localFilePath)
        return response

    } catch (error) {
        console.log(error);
        fs.unlinkSync(localFilePath)
        return null
        
    }
}

const deleteOnCloudinary=async(url,folder)=>{
    try {
        
        if(!url) return null

        const urlArray = url.split('/')
        
        const image=urlArray[urlArray.length -1];

        const imagePublicId =`backend/${folder}/${image.split('.')[0]}`

        const response = await cloudinary.uploader.destroy(imagePublicId)

        return response

    } catch (error) {
        console.log(error);
        return null
        
    }
}


export{uploadOnCloudinary,deleteOnCloudinary}

