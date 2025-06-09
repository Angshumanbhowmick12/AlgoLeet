import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "./ui/button";


const LogoutButton = ({children})=>{
    const {logout} = useAuthStore()

    const onLogout = async()=>{
        await logout();
        
    }



    return (
        <Button className=" bg-amber-600" onClick={onLogout}> 
            {children}
        </Button>
    )
}

export default LogoutButton;