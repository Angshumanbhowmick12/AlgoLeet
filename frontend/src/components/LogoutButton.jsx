import React from "react";
import { useAuthStore } from "../store/useAuthStore";


const LogoutButton = ({children})=>{
    const {logout} = useAuthStore()

    const onLogout = async()=>{
        await logout();
        
    }



    return (
        <button className="btn bg-amber-600" onClick={onLogout}> 
            {children}
        </button>
    )
}

export default LogoutButton;