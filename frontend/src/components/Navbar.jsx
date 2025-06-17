import React, { useEffect, useState } from "react"
import { User, Code, LogOut,UserIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { ModeToggle } from "./mode-toggle";



const Navbar = ()=>{

    const {authUser} = useAuthStore()

   const location=useLocation();

   const isActive=(path)=>location.pathname===path
    

    return (
     <nav className="sticky top-0 z-50 py-5 w-full">
      <div className="flex w-full max-w-7xl justify-between mx-auto  bg-black/15 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-border p-4 rounded-2xl">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <img src="/algoleet.png" className="h-8 w-10" />
          <span className="text-lg md:text-2xl font-bold tracking-tight text-amber-600 hidden md:block ml-[-10px]">
          AlgoLeet 
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">

              <Link 
              to="/"
              className={`text-lg font-medium transition-colors hover:text-amber-500 ${isActive('/') ? 'text-amber-500' : 'text-foreground/60'}`}
              >
                Home
              </Link>
              <Link 
              to="/problems"
              className={`text-lg font-medium transition-colors hover:text-amber-500 ${isActive('/problems') ? 'text-amber-500' : 'text-foreground/60'}`}
              >
                Problems
              </Link>
              <Link 
              to="/playlists"
              className={`text-lg font-medium transition-colors hover:text-amber-500 ${isActive('/playlists') ? 'text-amber-500' : 'text-foreground/60'}`}
              >
                Playlists
              </Link>
            </div>
        </div>
        
        {/* User Profile and Dropdown */}
        <div className="flex items-center gap-8">
           <ModeToggle/>

         {authUser?.data ? (<div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar flex flex-row ">
              
              <div className="w-10 rounded-full ">
                <img
                  src={
                    authUser?.data?.image ||
                    "https://avatar.iran.liara.run/public/boy"
                  }
                  alt="User Avatar"
                  className="object-cover"
                />
              </div>
           
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-accent/100 backdrop-opacity-100 rounded-box w-52 space-y-3"
            >
              {/* Admin Option */}
             

              {/* Common Options */}
              <li>
                <p className="text-base font-semibold">
                 
                  {authUser?.data?.name}

                </p>
                <hr className="border-gray-200/10" />
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:bg-primary hover:text-white text-base font-semibold"
                >
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </Link>
              </li>
              {authUser?.data?.role === "ADMIN" && (
                <li>
                  <Link
                    to="/add-problem"
                    className="hover:bg-primary hover:text-white text-base font-semibold"
                  >
                    <Code className="w-4 h-4 mr-1" />
                    Add Problem
                  </Link>
                </li>
              )}
              <li>
                <LogoutButton className="hover:bg-primary hover:text-white">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </LogoutButton>
              </li>
            </ul>
          </div>):(
            <div></div>
          )}  
          
        </div>
      </div>
    </nav>
    )
}


export default Navbar;