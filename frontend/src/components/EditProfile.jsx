
import { useEffect, useState } from 'react'
import React from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Upload } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { axiosInstance } from '../lib/axios'

const EditProfile = () => {
 
     const [selectedFile, setSelectedFile] = useState(null)

    const  handleFileChange=(e)=>{
        setSelectedFile(e.target.files[0])
    }

    const handleUpload=async()=>{
        if(!selectedFile){
            return
        }

        const formData=new FormData()

        formData.append("file",selectedFile)

        try{
            const res= await axiosInstance.patch('/auth/image',formData,{
                    headers: { 'Content-Type': 'multipart/form-data' },
                    
            })
            console.log('Upload successful:', res.data);
        }catch(error){
            console.error("Upload failed:",error);
            
        }
    }
    

  return (
    <div>
        
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
            <Upload/>
        </Button>
                
             </DialogTrigger>
            <DialogContent className="px-4 md:p-6">
                <DialogHeader>
                    <DialogTitle>
                        <input type='file' onChange={handleFileChange} />
                        <Button onClick={handleUpload}>
                            upload
                        </Button>
                    </DialogTitle>
                </DialogHeader>


            </DialogContent>
        </Dialog>

    </div>
  )
}

export default EditProfile