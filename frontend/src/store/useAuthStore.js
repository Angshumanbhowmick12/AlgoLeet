import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from'react-hot-toast'


export const useAuthStore=create((set)=>({
    authUser: null,
    isSigninUp: false,
    isloggingIn: false,
    isCheckingAuth: false,
    isUser:false,
    isimage:false,

    checkAuth: async()=>{
        set({ isCheckingAuth: true});
        try {
            const res = await axiosInstance.get("/auth/check");
            console.log("checkauth response",res.data.data);
            // console.log(res.data.data);
            
            set({authUser:res.data})
            
        } catch (error) {
            console.log("❌ Error checking auth:",error);
            set({authUser:null})
        }
        finally{
            set({isCheckingAuth:false})
        }
    },

    signup:async(data)=>{
        set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);

      set({ authUser: res.data.data });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error signing up", error);
      toast.error("Error signing up");
    } finally {
      set({ isSigninUp: false });
    }
    },
    login:async(data)=>{
        set({isloggingIn : true})
        try {
            const res = await axiosInstance.post("/auth/login",data)
            console.log(res.data.user);
            
            set({authUser:res.data.data.user})
            toast.success(res.data.message)
        } catch (error) {
            console.log("Error logging in",error);
            toast.error("Error logging in")
            
        }finally{
            set({isloggingIn:false})
        }
    },
    logout:async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null})
            toast.success("Logged SuccessFul")
        } catch (error) {
            console.log("Error logging out ",error);
            toast.error("Error logging out")
            
        }
    },

    getUser: async()=>{

        set({isUser:true})
            try {
                const res= await axiosInstance.get("/auth/profile")

                set({authUser: res.data.data})
            } catch (error) {
                console.log("Error when get user",error);
                set({authUser:null})
                
            }
            finally{
                set({ isUser:false})
            }
    },

    updateImage: async(image)=>{
        set({isimage:true})

        try {
            const res = await axiosInstance.patch("/auth/image",image)
                console.log("im",image);
                
                console.log("data",res.data.data);
                
            set({authUser:res.data.data[image]})

        } catch (error) {
            console.log("Error while update profile ",error);
            
        }
        finally{
            set({isimage:false})
        }
    }
}))