import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"


export const useProblemStore= create((set)=>({
    problems:[],
    problem:null,
    solvedProblems: [],
    isProblemsLoading: false,
    isProblemLoading: false,

    getAllProblems: async()=>{
        try {
            set({isProblemsLoading:true})
            const res= await axiosInstance.get("/problems/get-all-problems")
            console.log("p:" ,res.data.data);
            
            set({problems:res.data.data})
        } catch (error) {
            console.log("error getting all problems",error);
            toast.error("error in getting problems")
        } finally{
            set({ isProblemsLoading:false})
        }

    },

    getProblemById:async(id)=>{
        try {
            set({isProblemLoading:true})
            const res = await axiosInstance.get(`/problems/get-problem/${id}`)
            console.log("pi:",res.data.data);
            
            set({problem:res.data.data})
        } catch (error) {
            console.log("error in getting problems",error);
            toast.error("error in getting problems");
        }finally{
            set({isProblemLoading:false})
        }
    },
    getSolvedProblemByUser:async()=>{
        try {
            const res = await axiosInstance.get("/problems/get-solved-problem")
             console.log("psu:",res.data.data);
             set({solvedProblems:res.data})
        } catch (error) {
            console.log("Error getting solved problems",error);
            toast.error("error getting solved problems")
            
        }
    }

})) 