import React ,{useEffect}from 'react'
import { useAuthStore } from '../store/useAuthStore'
import UserAvatar from '../components/UserAvatar'
import { ShieldUser, User, User2Icon} from 'lucide-react'
import EditProfile from '../components/EditProfile'



const ProfilePage = () => {

const{authUser,getUser}=useAuthStore()


useEffect(() => {


    if (!authUser) {
        
        getUser()
    }
},[authUser,getUser])


console.log("auth",authUser);


  return (
    <div className='from-background to-muted/50 border-border mdp-8 relative mb-2 overflow-hidden rounded-2xl border bg-gradient-to-br p-2 md:p-8'>
        <div className="bg-grid-white/[0.02] absolute inset-0 bg-[size:32px]"/>
        <div className="relative flex items-center gap-8">
          <div className='group relative'>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-50 blur-xl transition-opacity group-hover:opacity-75" />
            <UserAvatar avatarUrl={authUser.data.image} size={56}/>    
            {
              authUser && authUser.data.role !== "ADMIN" ? (
                <div className="absolute -top-2 -right-2 z-20 animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-blue-600 p-2 shadow-lg">
                  <User className="h-4 w-4 text-white" />
              </div>
              ): <div className="absolute -top-2 -right-2 z-20 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-2 shadow-lg">
                  <ShieldUser className="h-4 w-4 text-white" />
              </div>
            }
          </div>
          <div>
            {authUser && authUser.data.role === "ADMIN" ? (
              
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-400">
                Admin
              </span>
            ): 
              (
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-400">
                User
              </span>
            ) }
          </div>
          <p className='text-muted-foreground flex items-center gap-2 text-xs'>
            <User2Icon className='h-4 w-4'/>
            {authUser.data.email}
          </p>
            <div className='ml-auto flex flex-wrap items-center justify-center gap-2 md:gap-3'>
              {authUser && <EditProfile/>}
            </div>
        </div>
            
        
    </div>
  )
}

export default ProfilePage